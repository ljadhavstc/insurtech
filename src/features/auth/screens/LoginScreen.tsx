/**
 * Login Screen
 * 
 * User login screen matching Figma design.
 * Uses phone number and password fields with react-hook-form for validation.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { authStore } from '@/stores/authStore';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import { 
  authenticateWithBiometric, 
  isBiometricEnabled, 
  checkBiometricAvailability,
  getBiometricName,
  enableBiometric,
  disableBiometric
} from '@/services/biometricService';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type LoginFormData = {
  phoneNumber: string;
  password: string;
};

export const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const login = authStore((state) => state.login);
  const { isLandscape } = useScreenDimensions(); // Orientation-aware responsive design

  // Check biometric availability and status on mount
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const [availability, enabled] = await Promise.all([
          checkBiometricAvailability(),
          isBiometricEnabled(),
        ]);
        
        setBiometricAvailable(availability.available);
        setBiometricEnabled(enabled);
        
        if (availability.available && availability.biometryType) {
          setBiometricType(getBiometricName(availability.biometryType));
        }
      } catch (error) {
        setBiometricAvailable(false);
        setBiometricEnabled(false);
      }
    };
    checkBiometric();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onChange', // Re-validate on change after first blur
  });

  const phoneNumber = watch('phoneNumber');
  const password = watch('password');
  
  // Check if form is valid:
  // 1. Both fields must have values
  // 2. No validation errors
  // 3. Password must be at least 8 characters
  const hasValues = phoneNumber && password && phoneNumber.trim() !== '' && password.trim() !== '';
  const hasErrors = Object.keys(errors).length > 0;
  const isPasswordValid = password ? password.length >= 8 : false;
  const isFormValid = hasValues && !hasErrors && isPasswordValid;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      const { user, token, refreshToken } = response.data;
      login(user, token, refreshToken);
      
      // If biometric is available and enabled, store the JWT token for future biometric login
      if (biometricAvailable && biometricEnabled) {
        try {
          await enableBiometric(token, refreshToken);
        } catch (error) {
          // Don't fail login if biometric storage fails
          console.warn('Failed to store biometric token:', error);
        }
      }
      
      showToast({ type: 'success', message: 'Login successful!' });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setBiometricLoading(true);
      
      const result = await authenticateWithBiometric();
      
      if (!result.success || !result.token) {
        showToast({
          type: 'error',
          message: result.error || t('auth.biometric.authFailed', 'Biometric authentication failed'),
        });
        return;
      }

      // Use the stored JWT token directly - verify it's still valid
      // In a real app, you might want to verify the token with the backend
      // For now, we'll use the token directly and let the API handle validation
      
      // Get user info from token (decode JWT payload) or make a verify call
      try {
        // Verify token is still valid by making an API call
        // This is a simple approach - in production you might decode JWT client-side
        const verifyResponse = await api.get('/auth/verify', {
          headers: {
            Authorization: `Bearer ${result.token}`,
          },
        });

        if (verifyResponse.data.user) {
          // Token is valid, login with stored token
          login(verifyResponse.data.user, result.token, result.refreshToken);
          showToast({ type: 'success', message: t('auth.biometric.loginSuccess', 'Login successful!') });
        } else {
          throw new Error('Invalid token');
        }
      } catch (verifyError: any) {
        // Token might be expired, try to refresh or show error
        showToast({
          type: 'error',
          message: t('auth.biometric.tokenExpired', 'Session expired. Please login again.'),
        });
        // Optionally disable biometric if token is invalid
        await disableBiometric();
        setBiometricEnabled(false);
      }
    } catch (error: any) {
      // Don't show error if user cancelled
      if (!error.message?.includes('cancel') && !error.message?.includes('UserCancel')) {
        showToast({
          type: 'error',
          message: error.response?.data?.message || error.message || t('auth.biometric.loginFailed', 'Biometric login failed'),
        });
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-theme-background">
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Status Bar Area - Design includes 46.15px status bar */}
          <View style={{ height: vs(46.15) }} />
          
          {/* Header */}
          <View className="border-b border-theme-border px-[15.38px] pt-[15.38px] pb-[15.38px]">
            <View className="flex-row justify-between items-center">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 justify-center items-center"
              >
                <Icon 
                  name="chevron-left" 
                  size={24} 
                  color={lightTheme.textPrimary} 
                />
              </TouchableOpacity>
              
              {/* Title */}
              <Text variant="onboardingHeader" className="text-theme-text-primary">
                login
              </Text>
              
              {/* Language Dropdown */}
              <LanguageDropdown />
            </View>
          </View>

          {/* Content Card */}
          <View className="flex-1 bg-theme-background px-md pt-md">
            {/* Card Header */}
            <View className="pb-xs">
              <Text variant="screenTitle" className="text-theme-text-primary">
                {t('auth.login.title')}
              </Text>
            </View>

            {/* Form Fields */}
            <View className="gap-md pt-md">
              <FormField
                control={control}
                name="phoneNumber"
                variant="mobile"
                label={t('auth.login.phoneNumber')}
                placeholder="eg. 33011234"
                testID="login-phone-input"
              />

              <FormField
                control={control}
                name="password"
                variant="password"
                label={t('auth.login.password')}
                placeholder="enter password"
                testID="login-password-input"
              />
            </View>

            {/* Buttons */}
            <View className="gap-sm pt-md pb-md">
              {/* Biometric Login Button */}
              {biometricAvailable && biometricEnabled && (
                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  disabled={biometricLoading}
                  className="mb-2 p-4 border border-theme-border rounded-sm bg-theme-background items-center justify-center"
                  style={{
                    minHeight: 56,
                    opacity: biometricLoading ? 0.6 : 1,
                  }}
                  testID="biometric-login-button"
                >
                  <View className="flex-row items-center gap-2">
                    {biometricLoading ? (
                      <Text variant="body" className="text-theme-text-primary">
                        {t('common.loading', 'Loading...')}
                      </Text>
                    ) : (
                      <>
                        <Text variant="body" className="text-theme-text-primary">
                          {t('auth.biometric.loginWith', { type: biometricType })}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              )}

              {/* Divider */}
              {biometricAvailable && biometricEnabled && (
                <View className="flex-row items-center my-2">
                  <View className="flex-1 h-px bg-theme-border" />
                  <Text variant="bodySmall" className="px-3 text-theme-text-secondary">
                    {t('auth.biometric.or', 'or')}
                  </Text>
                  <View className="flex-1 h-px bg-theme-border" />
                </View>
              )}

              <Button
                variant="solid"
                size="medium"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isFormValid}
                fullWidth
                testID="login-button"
              >
                {t('auth.login.loginButton')}
              </Button>

              <Button
                variant="ghost"
                size="medium"
                onPress={() => navigation.navigate('ForgotPassword')}
                fullWidth
                testID="forgot-password-button"
              >
                {t('auth.login.forgotPassword')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


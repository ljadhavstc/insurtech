/**
 * Password Setup Screen
 * 
 * Reusable screen for password setup that can be customized for different flows:
 * - Password reset
 * - Registration
 * - Password change
 * 
 * Highly customizable with configurable titles, subtitles, button text, and navigation.
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { Input } from '@/components/primitives/Input';
import { PasswordValidationRules } from '@/components/form/PasswordValidationRules';
import { PasswordStrengthMeter, usePasswordStrength } from '@/components/form/PasswordStrengthMeter';
import { MobileNumberWarning } from '@/components/form/MobileNumberWarning';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import { authStore } from '@/stores/authStore';
import { saveRegistrationStep } from '@/services/registrationStepService';

export type PasswordSetupPurpose = 'password-reset' | 'registration' | 'password-change';

export interface PasswordSetupScreenConfig {
  /**
   * Purpose of the screen - determines API endpoint and navigation flow
   */
  purpose: PasswordSetupPurpose;
  
  /**
   * Screen title in header
   */
  screenTitle?: string;
  
  /**
   * Main title text
   */
  title?: string;
  
  /**
   * Subtitle/description text
   */
  subtitle?: string;
  
  /**
   * Primary button text
   */
  buttonText?: string;
  
  /**
   * Mobile number for validation (optional)
   */
  mobileNumber?: string;
  
  /**
   * Email for API calls (optional)
   */
  email?: string;
  
  /**
   * Reset token (required for password-reset)
   */
  resetToken?: string;
  
  /**
   * Custom API endpoint (optional, defaults based on purpose)
   */
  apiEndpoint?: string;
  
  /**
   * Custom onSuccess callback (optional)
   * If provided, this will be called instead of default navigation
   */
  onSuccess?: (password: string, response: any) => void;
  
  /**
   * Next screen name for navigation (optional)
   * If not provided, defaults based on purpose
   */
  nextScreen?: string;
  
  /**
   * Additional params to pass to next screen
   */
  nextScreenParams?: Record<string, any>;
  
  /**
   * Show mobile number warning (default: true)
   */
  showMobileWarning?: boolean;
  
  /**
   * Show password validation rules (default: true)
   */
  showValidationRules?: boolean;
}

type PasswordSetupFormData = {
  newPassword: string;
  confirmPassword: string;
};

type AuthStackParamList = {
  PasswordSetup: { config: PasswordSetupScreenConfig };
  Success: { message?: string };
  Login: undefined;
  [key: string]: any;
};

type PasswordSetupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PasswordSetup'>;
type PasswordSetupScreenRouteProp = RouteProp<AuthStackParamList, 'PasswordSetup'>;

export const PasswordSetupScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<PasswordSetupScreenNavigationProp>();
  const route = useRoute<PasswordSetupScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const login = authStore((state) => state.login);
  const { isLandscape } = useScreenDimensions();
  
  const routeConfig = route.params?.config || {};
  const config: PasswordSetupScreenConfig = {
    ...routeConfig,
    purpose: (routeConfig.purpose || 'password-reset') as PasswordSetupPurpose,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordSetupFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Password strength check
  const { strength: passwordStrength, canProceed: canProceedWithPassword } = usePasswordStrength(newPassword || '');

  // Password validation function
  const validatePassword = (password: string): string | undefined => {
    if (!password) return undefined;
    
    if (password.length < 1) {
      return t('auth.resetPassword.passwordMinLength');
    }
    if (password.length > 25) {
      return t('auth.resetPassword.passwordMaxLength');
    }
    if (!/[a-z]/.test(password)) {
      return t('auth.resetPassword.passwordLowercase');
    }
    if (!/[A-Z]/.test(password)) {
      return t('auth.resetPassword.passwordUppercase');
    }
    if (!/[0-9]/.test(password)) {
      return t('auth.resetPassword.passwordNumber');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return t('auth.resetPassword.passwordSpecialChar');
    }
    if (config.mobileNumber && password.includes(config.mobileNumber)) {
      return t('auth.resetPassword.passwordContainsMobile');
    }
    return undefined;
  };

  // Check if passwords match
  const passwordsMatch = useMemo(() => {
    if (!newPassword || !confirmPassword) return true;
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const hasNewPassword = newPassword && newPassword.length > 0;
    const hasConfirmPassword = confirmPassword && confirmPassword.length > 0;
    const passwordsMatchValue = newPassword === confirmPassword;
    const passwordIsStrong = canProceedWithPassword;
    const passwordValid = validatePassword(newPassword) === undefined;
    return hasNewPassword && hasConfirmPassword && passwordsMatchValue && passwordIsStrong && passwordValid;
  }, [newPassword, confirmPassword, canProceedWithPassword, config.mobileNumber]);

  // Get default values based on purpose
  const getDefaultConfig = () => {
    switch (config.purpose) {
      case 'password-reset':
        return {
          screenTitle: t('auth.resetPassword.screenTitle'),
          title: t('auth.resetPassword.title'),
          subtitle: t('auth.resetPassword.subtitle'),
          buttonText: t('auth.resetPassword.reset'),
          apiEndpoint: '/auth/reset-password',
          nextScreen: 'Success',
          showMobileWarning: true,
          showValidationRules: true,
        };
      case 'registration':
        return {
          screenTitle: t('auth.register.passwordScreenTitle', 'set password'),
          title: t('auth.register.passwordTitle', 'create password'),
          subtitle: t('auth.register.passwordSubtitle', 'your password must contain:'),
          buttonText: t('auth.register.continue', 'continue'),
          apiEndpoint: '/auth/register/complete',
          nextScreen: 'Success',
          showMobileWarning: true,
          showValidationRules: true,
        };
      case 'password-change':
        return {
          screenTitle: t('auth.changePassword.screenTitle', 'change password'),
          title: t('auth.changePassword.title', 'enter new password'),
          subtitle: t('auth.changePassword.subtitle', 'your password must contain:'),
          buttonText: t('auth.changePassword.save', 'save password'),
          apiEndpoint: '/auth/change-password',
          nextScreen: 'Success',
          showMobileWarning: false,
          showValidationRules: true,
        };
      default:
        return {};
    }
  };

  const defaultConfig = getDefaultConfig();
  const finalConfig = { ...defaultConfig, ...config };

  const onSubmit = async (data: PasswordSetupFormData) => {
    try {
      setLoading(true);
      
      let response;
      const endpoint = finalConfig.apiEndpoint || '/auth/reset-password';
      
      if (config.purpose === 'registration') {
        // Registration flow - just validate password, don't complete registration yet
        // We'll complete it after email is entered
        // For now, just return success to proceed to email screen
        response = {
          data: {
            success: true,
            message: 'Password set successfully',
          },
        };
      } else if (config.purpose === 'password-reset') {
        // Password reset flow
        response = await api.post(endpoint, {
          email: config.email || config.mobileNumber,
          resetToken: config.resetToken,
          newPassword: data.newPassword,
        });
      } else {
        // Password change flow
        response = await api.post(endpoint, {
          newPassword: data.newPassword,
          currentPassword: '', // This would need to be provided
        });
      }

      showToast({ type: 'success', message: response.data.message || 'Password set successfully' });
      
      // Save step data for registration flow
      if (config.purpose === 'registration') {
        await saveRegistrationStep('password-setup', {
          mobileNumber: config.mobileNumber,
          email: config.email,
          password: data.newPassword, // Note: In production, don't store password in plain text
          resetToken: config.resetToken,
          response: response.data,
        });
        
        // Log customer step: Password set for registration
        const mobileNumber = config.mobileNumber;
        if (mobileNumber) {
          try {
            const { logCustomerStepRequest } = await import('@/services/requests');
            await logCustomerStepRequest(mobileNumber, 'Password set for registration');
          } catch (logError) {
            // Don't fail if logging fails
            console.warn('Failed to log customer step:', logError);
          }
        }
      }
      
      // If custom onSuccess callback provided, use it
      if (finalConfig.onSuccess) {
        finalConfig.onSuccess(data.newPassword, response.data);
        return;
      }
      
      // For registration, navigate to email input screen instead of auto-login
      if (config.purpose === 'registration') {
        // Navigate to email input screen
        navigation.navigate('EmailInput', {
          mobileNumber: config.mobileNumber,
          password: data.newPassword,
          resetToken: config.resetToken,
        });
        return;
      }
      
      // Auto-login for other purposes (if applicable)
      if (response.data.user && response.data.token) {
        login(response.data.user, response.data.token, response.data.refreshToken);
      }
      
      // Default navigation
      const nextScreen = finalConfig.nextScreen || 'Success';
      const nextParams = {
        message: response.data.message || 'Password set successfully',
        ...finalConfig.nextScreenParams,
      };
      
      navigation.navigate(nextScreen as any, nextParams);
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to set password',
      });
    } finally {
      setLoading(false);
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
          {/* Status Bar Area */}
          <View style={{ height: vs(46.15) }} />

          {/* Header */}
          <View className="border-b border-theme-border px-[15.38px] pt-[15.38px] pb-[15.38px]">
            <View className="flex-row justify-between items-center">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 justify-center items-center"
              >
                <Icon name="chevron-left" size={24} color={lightTheme.textPrimary} />
              </TouchableOpacity>

              {/* Title */}
              <Text variant="onboardingHeader" className="text-theme-text-primary">
                {finalConfig.screenTitle || 'Set Password'}
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
                {finalConfig.title || 'Enter New Password'}
              </Text>
            </View>

            {/* New Password Field */}
            <View className="pb-md">
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: t('auth.resetPassword.passwordRequired'),
                  validate: validatePassword,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="password"
                    value={value || ''}
                    onChangeText={onChange}
                    label={t('auth.resetPassword.newPassword')}
                    placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                    error={errors.newPassword?.message}
                    testID="password-setup-new-input"
                  />
                )}
              />
            </View>

            {/* Confirm Password Field */}
            <View className="pb-md">
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: t('auth.resetPassword.confirmPasswordRequired'),
                  validate: (value) => {
                    if (!value) return t('auth.resetPassword.confirmPasswordRequired');
                    if (value !== newPassword) return t('auth.resetPassword.passwordsMatch');
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    variant="password"
                    value={value || ''}
                    onChangeText={onChange}
                    label={t('auth.resetPassword.confirmPassword')}
                    placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                    error={errors.confirmPassword?.message}
                    testID="password-setup-confirm-input"
                  />
                )}
              />
              
              {/* Password Match Indicator */}
              {confirmPassword && confirmPassword.length > 0 && (
                <View className="mt-xs">
                  <View className="flex-row items-center gap-xs">
                    {passwordsMatch && (
                      <>
                        <View className="w-4 h-4 items-center justify-center">
                          <Text className="text-success text-xs">✓</Text>
                        </View>
                        <Text variant="caption" className="text-success lowercase">
                          great! your passwords match.
                        </Text>
                      </>
                    ) }
                  </View>
                </View>
              )}
            </View>

            {/* Password Strength Meter */}
            <View className="mt-xs mb-md">
              <PasswordStrengthMeter password={newPassword || ''} />
            </View>
            
            {/* Mobile Number Warning */}
            {finalConfig.showMobileWarning !== false && config.mobileNumber && (
              <MobileNumberWarning password={newPassword} mobileNumber={config.mobileNumber} />
            )}

            {/* Subtitle */}
            {finalConfig.subtitle && (
              <View className="pb-md">
                <Text variant="text-small-tight" className="text-theme-text-primary">
                  {finalConfig.subtitle}
                </Text>
              </View>
            )}
            
            {/* Password Validation Rules */}
            {finalConfig.showValidationRules !== false && (
              <PasswordValidationRules
                password={newPassword || ''}
                mobileNumber={config.mobileNumber}
                showWhenEmpty={true}
              />
            )}
            
            {/* Buttons */}
            <View className="gap-sm pt-md pb-md">
              <Button
                variant="solid"
                size="medium"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isFormValid}
                fullWidth
                testID="password-setup-button"
              >
                {finalConfig.buttonText || 'Continue'}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


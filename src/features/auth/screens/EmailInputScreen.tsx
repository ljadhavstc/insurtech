/**
 * Email Input Screen
 * 
 * Screen for entering email address during registration.
 * Shows popular email domain suggestions (gmail, outlook, yahoo).
 * Clicking a suggestion auto-fills the domain in the email input.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme, baseColors } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import api from '@/services/api';
import { authStore } from '@/stores/authStore';
import { 
  checkBiometricAvailability, 
  enableBiometric, 
  getBiometricName 
} from '@/services/biometricService';
import { saveRegistrationStep } from '@/services/registrationStepService';
import { logCustomerStepRequest, registerRequest } from '@/services/requests';

type EmailInputFormData = {
  email: string;
};

type AuthStackParamList = {
  EmailInput: { mobileNumber?: string; password?: string; resetToken?: string };
  Success: { message?: string };
  Login: undefined;
  [key: string]: any;
};

type EmailInputScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailInput'>;
type EmailInputScreenRouteProp = RouteProp<AuthStackParamList, 'EmailInput'>;

// Popular email domains
const EMAIL_DOMAINS = [
  { domain: '@gmail.com', label: '@gmail.com' },
  { domain: '@outlook.com', label: '@outlook.com' },
  { domain: '@yahoo.com', label: '@yahoo.com' },
];

export const EmailInputScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<EmailInputScreenNavigationProp>();
  const route = useRoute<EmailInputScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [enableBiometricLogin, setEnableBiometricLogin] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [checkingBiometric, setCheckingBiometric] = useState(true);
  const login = authStore((state) => state.login);
  const setBiometricEnabled = authStore((state) => state.setBiometricEnabled);
  const { isLandscape } = useScreenDimensions();

  const { mobileNumber, password, resetToken } = route.params || {};

  // Check biometric availability on mount
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const result = await checkBiometricAvailability();
        setBiometricAvailable(result.available);
        if (result.available && result.biometryType) {
          setBiometricType(getBiometricName(result.biometryType));
        }
      } catch (error) {
        setBiometricAvailable(false);
      } finally {
        setCheckingBiometric(false);
      }
    };
    checkBiometric();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EmailInputFormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const email = watch('email');

  // Check if form is valid
  const hasValue = email && email.trim() !== '';
  const hasErrors = Object.keys(errors).length > 0;
  const isFormValid = hasValue && !hasErrors;

  // Handle domain suggestion click
  const handleDomainSuggestion = (domain: string) => {
    const currentEmail = email || '';
    
    // If email already contains @, replace everything after @
    if (currentEmail.includes('@')) {
      const localPart = currentEmail.split('@')[0].trim();
      // Only use local part if it's not empty
      if (localPart) {
        setValue('email', `${localPart}${domain}`, { shouldValidate: true });
      } else {
        // If local part is empty, just set the domain (user can type before @)
        setValue('email', domain, { shouldValidate: false });
      }
    } else {
      // If no @, append the domain to existing text
      const trimmedEmail = currentEmail.trim();
      setValue('email', `${trimmedEmail}${domain}`, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: EmailInputFormData) => {
    try {
      setLoading(true);

      if (!mobileNumber || !password) {
        throw new Error('Mobile number and password are required');
      }

      // Call register API with all required data
      // CPR is hardcoded for now, will come from JUMIO later
      const response = await registerRequest(
        mobileNumber, // username
        password,     // password
        mobileNumber, // mobile
        data.email,   // email
        '22347889'    // cpr (hardcoded for now)
      );

      // Show exact success message from API
      const successMessage = response.message || 'Registration completed successfully';
      showToast({ type: 'success', message: successMessage });
      
      // Save step data for registration flow
      await saveRegistrationStep('email-input', {
        mobileNumber,
        email: data.email,
        password,
        response: response,
      });
      
      // Log customer step: Registration completed
      if (mobileNumber) {
        try {
          await logCustomerStepRequest(mobileNumber, 'Registration completed');
        } catch (logError) {
          // Don't fail if logging fails
          console.warn('Failed to log customer step:', logError);
        }
      }
      
      // Auto-login if user data is returned
      if (
        response.user &&
        typeof response.user.id === "string" &&
        response.token &&
        typeof response.token === "string" &&
        response.refreshToken &&
        typeof response.refreshToken === "string"
      ) {
        login(
          {
            ...response.user,
            id: response.user.id, // id is guaranteed a string here
          },
          response.token,
          response.refreshToken
        );
      }
      
      // Navigate to Success screen with exact message from API
      // Skip JUMIO verification screens for now
      navigation.navigate('Success', {
        message: successMessage,
      });
    } catch (error: any) {
      // Show exact error message from API
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete registration';
      showToast({
        type: 'error',
        message: errorMessage,
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
                {t('auth.register.emailScreenTitle', 'account registration')}
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
                {t('auth.register.emailTitle', 'enter your email')}
              </Text>
            </View>

            {/* Subtitle */}
            <View className="pb-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.register.emailSubtitle', 'enter your email address.')}
              </Text>
            </View>

            {/* Email Input Field */}
            <View className="gap-md pt-md">
              <FormField
                control={control}
                name="email"
                variant="email"
                label={t('auth.register.email', 'email')}
                placeholder="acd@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                testID="email-input"
                rules={{
                  required: t('auth.register.emailRequired', 'Email is required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth.register.emailInvalid', 'email is invalid'),
                  },
                }}
              />
            </View>

            {/* Domain Suggestions */}
            <View className="gap-sm pt-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.register.emailSuggestions', 'suggestions:')}
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {EMAIL_DOMAINS.map((item) => (
                  <TouchableOpacity
                    key={item.domain}
                    onPress={() => handleDomainSuggestion(item.domain)}
                    className="px-3 py-2 border border-theme-border rounded-sm bg-theme-background items-center justify-center"
                    style={{ 
                      minHeight: 36,
                      borderRadius: 2,
                    }}
                  >
                    <Text variant="bodySmall" className="text-theme-text-base-secondary">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Biometric Login Toggle */}
            {!checkingBiometric && biometricAvailable && (
              <View className="gap-sm pt-md">
                <View className="flex-row items-center justify-between p-3 border border-theme-border rounded-sm bg-theme-background">
                  <View className="flex-1 pr-3">
                    <Text variant="body" className="text-theme-text-primary mb-1">
                      {t('auth.biometric.enableTitle', { type: biometricType })}
                    </Text>
                    <Text variant="bodySmall" className="text-theme-text-secondary">
                      {t('auth.biometric.enableDescription', { type: biometricType })}
                    </Text>
                  </View>
                  <Switch
                    value={enableBiometricLogin}
                    onValueChange={setEnableBiometricLogin}
                    trackColor={{ false: '#E5E7EB', true: baseColors.primary }}
                    thumbColor={enableBiometricLogin ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#E5E7EB"
                  />
                </View>
              </View>
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
                testID="email-submit-button"
              >
                {t('auth.register.continue', 'continue')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


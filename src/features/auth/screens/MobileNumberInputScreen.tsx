/**
 * Mobile Number Input Screen
 * 
 * Reusable screen for mobile number input that can be customized for different flows:
 * - Password reset
 * - Registration
 * - Account verification
 * 
 * Highly customizable with configurable titles, subtitles, button text, and navigation.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { generateOTPRequest } from '@/services/requests';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import { saveRegistrationStep } from '@/services/registrationStepService';
import { logCustomerStepRequest } from '@/services/requests';

export type MobileNumberInputPurpose = 'password-reset' | 'registration' | 'verification';

export interface MobileNumberInputScreenConfig {
  /**
   * Purpose of the screen - determines API endpoint and navigation flow
   */
  purpose: MobileNumberInputPurpose;
  
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
   * Secondary button text (optional)
   */
  secondaryButtonText?: string;
  
  /**
   * Callback when secondary button is pressed
   */
  onSecondaryButtonPress?: () => void;
  
  /**
   * Custom API endpoint (optional, defaults based on purpose)
   */
  apiEndpoint?: string;
  
  /**
   * Custom validation rules (optional)
   */
  validationRules?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
  };
  
  /**
   * Custom onSuccess callback (optional)
   * If provided, this will be called instead of default navigation
   */
  onSuccess?: (mobileNumber: string, response: any) => void;
  
  /**
   * Next screen name for navigation (optional)
   * If not provided, defaults based on purpose
   */
  nextScreen?: string;
  
  /**
   * Additional params to pass to next screen
   */
  nextScreenParams?: Record<string, any>;
}

type MobileNumberInputFormData = {
  mobileNumber: string;
};

type AuthStackParamList = {
  MobileNumberInput: { config: MobileNumberInputScreenConfig };
  OTPVerification: { mobileNumber?: string; email?: string; purpose?: MobileNumberInputPurpose };
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  [key: string]: any;
};

type MobileNumberInputScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'MobileNumberInput'>;
type MobileNumberInputScreenRouteProp = RouteProp<AuthStackParamList, 'MobileNumberInput'>;

interface MobileNumberInputScreenProps {
  config?: MobileNumberInputScreenConfig;
}

export const MobileNumberInputScreen: React.FC<MobileNumberInputScreenProps> = ({ config: propConfig }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<MobileNumberInputScreenNavigationProp>();
  const route = useRoute<MobileNumberInputScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isLandscape } = useScreenDimensions();
  
  // Get config from route params or props (route params take precedence)
  const config = route.params?.config || propConfig || { purpose: 'password-reset' };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MobileNumberInputFormData>({
    defaultValues: {
      mobileNumber: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const mobileNumber = watch('mobileNumber');
  
  // Check if form is valid
  const hasValue = mobileNumber && mobileNumber.trim() !== '';
  const hasErrors = Object.keys(errors).length > 0;
  const isFormValid = hasValue && !hasErrors;

  // Get default values based on purpose
  const getDefaultConfig = () => {
    switch (config.purpose) {
      case 'password-reset':
        return {
          screenTitle: t('auth.forgotPassword.screenTitle'),
          title: t('auth.forgotPassword.title'),
          subtitle: t('auth.forgotPassword.screenSubtitle'),
          buttonText: t('auth.forgotPassword.sendCode'),
          secondaryButtonText: t('auth.forgotPassword.backToLogin'),
          apiEndpoint: '/auth/forgot-password',
          nextScreen: 'OTPVerification',
          validationRules: {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{8,15}$/,
              message: 'mobile number is invalid',
            },
          },
        };
      case 'registration':
        return {
          screenTitle: t('auth.register.mobileScreenTitle', 'account registration'),
          title: t('auth.register.mobileTitle', 'enter your number'),
          subtitle: t('auth.register.mobileSubtitle', 'enter your number to create account.'),
          buttonText: t('auth.register.continue', 'continue'),
          apiEndpoint: '/auth/register/send-otp',
          nextScreen: 'OTPVerification',
          validationRules: {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{8,15}$/,
              message: 'mobile number is invalid',
            },
          },
        };
      case 'verification':
        return {
          screenTitle: t('auth.verification.screenTitle', 'verify account'),
          title: t('auth.verification.title', 'enter your number'),
          subtitle: t('auth.verification.subtitle', 'enter your mobile number to verify your account.'),
          buttonText: t('auth.verification.sendCode', 'Send Code'),
          apiEndpoint: '/auth/verify/send-otp',
          nextScreen: 'OTPVerification',
          validationRules: {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{8,15}$/,
              message: 'mobile number is invalid',
            },
          },
        };
      default:
        return {};
    }
  };

  const defaultConfig = getDefaultConfig();
  const finalConfig = { ...defaultConfig, ...config };

  const onSubmit = async (data: MobileNumberInputFormData) => {
    try {
      setLoading(true);
      
      let response;
      
      // Use generate-otp API for registration and password-reset flows
      if (config.purpose === 'registration' || config.purpose === 'password-reset') {
        response = await generateOTPRequest(data.mobileNumber);
        showToast({ 
          type: 'success', 
          message: response.message || 'OTP sent successfully to your mobile number' 
        });
      } else {
        // For other flows (verification), use existing endpoint
        const endpoint = finalConfig.apiEndpoint || '/auth/verify/send-otp';
        const apiResponse = await api.post(endpoint, {
          mobileNumber: data.mobileNumber,
        });
        response = apiResponse.data;
        showToast({ type: 'success', message: response.message || 'Code sent successfully' });
      }
      
      // Save step data for registration flow
      if (config.purpose === 'registration') {
        await saveRegistrationStep('mobile-input', {
          mobileNumber: data.mobileNumber,
          response: response,
        });
        
        // Log customer step: Mobile number entered for registration
        try {
          await logCustomerStepRequest(data.mobileNumber, 'Mobile number entered for registration');
        } catch (logError) {
          // Don't fail if logging fails
          console.warn('Failed to log customer step:', logError);
        }
      }
      
      // If custom onSuccess callback provided, use it
      if (finalConfig.onSuccess) {
        finalConfig.onSuccess(data.mobileNumber, response.data);
        return;
      }
      
      // Default navigation based on purpose
      const nextScreen = finalConfig.nextScreen || 'OTPVerification';
      const nextParams = {
        mobileNumber: data.mobileNumber,
        purpose: config.purpose,
        ...finalConfig.nextScreenParams,
      };
      
      navigation.navigate(nextScreen as any, nextParams);
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to send code',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecondaryButton = () => {
    if (finalConfig.onSecondaryButtonPress) {
      finalConfig.onSecondaryButtonPress();
    } else if (config.purpose === 'password-reset') {
      navigation.navigate('Login');
    } else {
      navigation.goBack();
    }
  };

  const validationRules = finalConfig.validationRules || {
    required: 'Mobile number is required',
    pattern: {
      value: /^[0-9]{8,15}$/,
      message: 'mobile number is invalid',
    },
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
                {finalConfig.screenTitle || 'Enter Mobile Number'}
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
                {finalConfig.title || 'Enter Your Number'}
              </Text>
            </View>

            {/* Subtitle */}
            {finalConfig.subtitle && (
              <View className="pb-md">
                <Text variant="bodySmall" className="text-theme-text-secondary">
                  {finalConfig.subtitle}
                </Text>
              </View>
            )}

            {/* Form Fields */}
            <View className="gap-md pt-md">
              <FormField
                control={control}
                name="mobileNumber"
                variant="mobile"
                label={t('auth.forgotPassword.mobileNumber')}
                placeholder={t('auth.forgotPassword.mobileNumberPlaceholder')}
                testID="mobile-number-input"
                rules={validationRules}
                keyboardType="phone-pad"
              />
            </View>

            {/* Buttons */}
            <View className="gap-sm pt-md pb-md">
              <Button
                variant="solid"
                size="medium"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isFormValid}
                fullWidth
                testID="submit-button"
              >
                {finalConfig.buttonText || 'Continue'}
              </Button>

              {finalConfig.secondaryButtonText && (
                <Button
                  variant="ghost"
                  size="medium"
                  onPress={handleSecondaryButton}
                  fullWidth
                  testID="secondary-button"
                >
                  {finalConfig.secondaryButtonText}
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


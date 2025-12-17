/**
 * OTP Verification Screen
 * 
 * Comprehensive OTP verification screen with timer, error handling, and cooldown mechanism.
 * Reusable for password reset and other OTP authentication flows.
 * Matches Figma design structure with header, content card, and form fields.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, AppState } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { OTPInput } from '@/components/form/OTPInput';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';

type AuthStackParamList = {
  OTPVerification: { mobileNumber?: string; email?: string; purpose?: 'password-reset' | 'verification' };
  ResetPassword: { mobileNumber?: string; email?: string; resetToken: string };
  ForgotPassword: { mobileNumber?: string; email?: string };
  Login: undefined;
};

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

type OTPFormData = {
  otp: string;
};

const RESEND_COOLDOWN = 60; // seconds
const OTP_LENGTH = 4;

export const OTPVerificationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const mobileNumber = route.params?.mobileNumber || route.params?.email || '';
  const purpose = route.params?.purpose || 'password-reset';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OTPFormData>({
    defaultValues: {
      otp: '',
    },
    mode: 'onBlur',
  });

  const otpValue = watch('otp');

  // Timer effect for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Timer effect for cooldown period
  useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setTimeout(() => {
        setCooldownTimer(cooldownTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTimer]);

  // Start resend timer on mount
  useEffect(() => {
    setResendTimer(RESEND_COOLDOWN);
  }, []);

  // Handle app state changes to sync timer
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && resendTimer > 0) {
        // Timer continues in background, no need to reset
      }
    });

    return () => {
      subscription.remove();
    };
  }, [resendTimer]);

  const onSubmit = async (data: OTPFormData) => {
    if (data.otp.length !== OTP_LENGTH) {
      setErrorMessage(t('auth.otpVerification.otpInvalid'));
      setIsSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setIsSuccess(false);

      const response = await api.post('/auth/otp-verify', {
        mobileNumber: route.params?.mobileNumber || undefined,
        email: route.params?.email || undefined,
        otp: data.otp,
      });

      // Show success state
      setIsSuccess(true);
      showToast({ type: 'success', message: response.data.message || t('auth.otpVerification.success') });

      // Navigate after a short delay to show success state
      setTimeout(() => {
        // Navigate based on purpose
        if (purpose === 'password-reset') {
          navigation.navigate('ResetPassword', {
            mobileNumber: route.params?.mobileNumber,
            email: route.params?.email,
            resetToken: response.data.resetToken,
          });
        } else {
          // For other verification purposes, navigate back or to appropriate screen
          navigation.navigate('Login');
        }
      }, 1000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || t('auth.otpVerification.invalidOTP');
      setErrorMessage(errorMsg);
      setIsSuccess(false);

      // Check if error indicates cooldown period
      if (errorMsg.includes('wait') && errorMsg.includes('minutes')) {
        const minutesMatch = errorMsg.match(/(\d+)\s*minutes?/);
        if (minutesMatch) {
          const minutes = parseInt(minutesMatch[1], 10);
          setCooldownTimer(minutes * 60);
        }
      }

      showToast({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || cooldownTimer > 0) {
      return;
    }

    try {
      setResendLoading(true);
      setErrorMessage('');

      const response = await api.post('/auth/forgot-password', {
        mobileNumber: route.params?.mobileNumber || undefined,
        email: route.params?.email || undefined,
      });

      // Reset OTP input
      setValue('otp', '');

      // Start resend timer
      setResendTimer(RESEND_COOLDOWN);

      showToast({ type: 'success', message: response.data.message || t('auth.otpVerification.otpResent') });

      // Log OTP in development (remove in production)
      if (__DEV__ && response.data.otp) {
        console.log(`[DEV] OTP: ${response.data.otp}`);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || t('auth.otpVerification.resendFailed');
      setErrorMessage(errorMsg);

      // Check if error indicates cooldown period
      if (errorMsg.includes('wait') && errorMsg.includes('minutes')) {
        const minutesMatch = errorMsg.match(/(\d+)\s*minutes?/);
        if (minutesMatch) {
          const minutes = parseInt(minutesMatch[1], 10);
          setCooldownTimer(minutes * 60);
        }
      }

      showToast({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  const canResend = resendTimer === 0 && cooldownTimer === 0 && !resendLoading;
  const isFormValid = otpValue.length === OTP_LENGTH && !errors.otp;

  return (
    <View className="flex-1 bg-theme-background">
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
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
                {t('auth.otpVerification.screenTitle')}
              </Text>

              {/* Language Dropdown */}
              <LanguageDropdown />
            </View>
          </View>

          {/* Content Card */}
          <View className="flex-1 bg-theme-background px-md pt-md">
            {/* Card Header */}
            <View className="pb-xs">
              <Text variant="h1" className="text-theme-text-primary">
                {t('auth.otpVerification.title')}
              </Text>
            </View>

            {/* Subtitle */}
            <View className="pb-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.otpVerification.subtitle', { mobileNumber })}
              </Text>
            </View>

            {/* OTP Input */}
            <View className="pt-md pb-xs">
              <Controller
                control={control}
                name="otp"
                rules={{
                  required: t('auth.otpVerification.otpRequired'),
                  minLength: {
                    value: OTP_LENGTH,
                    message: t('auth.otpVerification.otpInvalid'),
                  },
                  maxLength: {
                    value: OTP_LENGTH,
                    message: t('auth.otpVerification.otpInvalid'),
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <OTPInput
                    value={value || ''}
                    onChangeText={(text) => {
                      onChange(text);
                      setErrorMessage('');
                      setIsSuccess(false);
                    }}
                    error={errorMessage || errors.otp?.message}
                    success={isSuccess && value.length === OTP_LENGTH}
                    disabled={loading || cooldownTimer > 0}
                    autoFocus
                    testID="otp-input"
                  />
                )}
              />
            </View>

            {/* Buttons */}
            <View className="gap-sm pt-md pb-md">
              <Button
                variant="solid"
                size="medium"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isFormValid || cooldownTimer > 0}
                fullWidth
                testID="verify-otp-button"
              >
                {t('auth.otpVerification.verify')}
              </Button>
            </View>

            {/* Resend Section - Moved below Verify button */}
            <View className="pt-xs pb-md">
              {cooldownTimer > 0 ? (
                <View className="items-center">
                  <Text variant="caption" className="text-error-dark text-center lowercase">
                    {t('auth.otpVerification.cooldownMessage', { time: formatTime(cooldownTimer) }).toLowerCase()}
                  </Text>
                </View>
              ) : resendTimer > 0 ? (
                <View className="items-center">
                  <Text variant="caption" className="text-theme-text-secondary text-center lowercase">
                    {t('auth.otpVerification.resendTimer', { time: formatTime(resendTimer) }).toLowerCase()}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={!canResend || resendLoading}
                  className="items-center"
                >
                  <Text 
                    variant="caption" 
                    className={`text-center lowercase ${canResend ? 'text-theme-interactive-active' : 'text-theme-text-tertiary'}`}
                  >
                    {resendLoading ? t('auth.otpVerification.resending').toLowerCase() : t('auth.otpVerification.resend').toLowerCase()}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

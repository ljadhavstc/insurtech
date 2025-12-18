/**
 * Reset Password Screen
 * 
 * Screen for resetting password after OTP verification.
 * Includes password validation rules and mobile number warning.
 * Matches Figma design structure with header, content card, and form fields.
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
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';

type AuthStackParamList = {
  ResetPassword: { mobileNumber?: string; email?: string; resetToken: string };
  Login: undefined;
};

type ResetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { mobileNumber, email, resetToken } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change for real-time feedback
    reValidateMode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Password strength check
  const { strength: passwordStrength, canProceed: canProceedWithPassword } = usePasswordStrength(newPassword || '');

  // Password validation function
  const validatePassword = (password: string): string | undefined => {
    if (!password) return undefined; // Let required rule handle empty
    
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
    if (mobileNumber && password.includes(mobileNumber)) {
      return t('auth.resetPassword.passwordContainsMobile');
    }
    return undefined;
  };

  // Check if passwords match
  const passwordsMatch = useMemo(() => {
    if (!newPassword || !confirmPassword) return true; // Don't show error until both are filled
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  // Check if form is valid - password must be strong and all other validations pass
  const isFormValid = useMemo(() => {
    const hasNewPassword = newPassword && newPassword.length > 0;
    const hasConfirmPassword = confirmPassword && confirmPassword.length > 0;
    const noErrors = !errors.newPassword && !errors.confirmPassword;
    const passwordsMatchValue = newPassword === confirmPassword;
    const passwordIsStrong = canProceedWithPassword; // Only allow proceed when strength is "strong"
    return hasNewPassword && hasConfirmPassword && noErrors && passwordsMatchValue && passwordIsStrong;
  }, [newPassword, confirmPassword, errors, canProceedWithPassword]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        email: email || mobileNumber,
        resetToken,
        newPassword: data.newPassword,
      });

      showToast({ type: 'success', message: response.data.message || 'Password reset successfully' });
      
      // Navigate to login screen
      navigation.navigate('Login');
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to reset password',
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
                {t('auth.resetPassword.screenTitle')}
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
                {t('auth.resetPassword.title')}
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
                    testID="reset-password-new-input"
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
                    testID="reset-password-confirm-input"
                  />
                )}
              />
              
            {/* Mobile Number Warning - Sticky Bar */}

              {/* Password Match Indicator */}
              {confirmPassword && confirmPassword.length > 0 && (
                <View className="mt-xs">
                  <View className="flex-row items-center gap-xs">
                    {passwordsMatch ? (
                      <>
                        <View className="w-4 h-4 items-center justify-center">
                          <Text className="text-success text-xs">✓</Text>
                        </View>
                        <Text variant="caption" className="text-success lowercase">
                          passwords match
                        </Text>
                      </>
                    ) : (
                      <>
                        <View className="w-4 h-4 items-center justify-center">
                          <Text className="text-error-dark text-xs">✕</Text>
                        </View>
                        <Text variant="caption" className="text-error-dark lowercase">
                          passwords do not match
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              )}
                        </View>

                {/* Password Strength Meter */}
                <View className="mt-xs mb-md">
                <PasswordStrengthMeter password={newPassword || ''} />
              </View>
            <MobileNumberWarning password={newPassword} mobileNumber={mobileNumber} />

            {/* Subtitle */}
            <View className="pb-md">
              <Text variant="text-small-tight" className="text-theme-text-primary">
                {t('auth.resetPassword.subtitle')}
              </Text>
            </View>
  {/* Password Validation Rules */}
  <PasswordValidationRules
                password={newPassword || ''}
                mobileNumber={mobileNumber}
                showWhenEmpty={true}
              />
            {/* Buttons */}
            <View className="gap-sm pt-md pb-md">
              <Button
                variant="solid"
                size="medium"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isFormValid}
                fullWidth
                testID="reset-password-button"
              >
                {t('auth.resetPassword.reset')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


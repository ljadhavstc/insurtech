/**
 * Forgot Password Screen
 * 
 * Screen for requesting password reset OTP.
 * Matches Figma design structure with header, content card, and form fields.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import { generateOTPRequest } from '@/services/requests';

type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: { mobileNumber: string; purpose: 'password-reset' };
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

type ForgotPasswordFormData = {
  mobileNumber: string;
  purpose: 'password-reset';
};

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isLandscape } = useScreenDimensions(); // Orientation-aware responsive design

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      mobileNumber: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const mobileNumber = watch('mobileNumber');
  
  // Check if form is valid
  const hasValue = mobileNumber && mobileNumber.trim() !== '' && typeof mobileNumber === 'string';
  const hasErrors = Object.keys(errors).length > 0;
  const isFormValid = hasValue && !hasErrors;
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      const response = await generateOTPRequest(data.mobileNumber);

      showToast({ type: 'success', message: response.message || 'Code sent successfully' });
      
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { 
        mobileNumber: data.mobileNumber.toString(),
        purpose: data.purpose,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to send OTP',
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
                {t('auth.forgotPassword.screenTitle')}
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
                {t('auth.forgotPassword.title')}
              </Text>
            </View>

            {/* Subtitle */}
            <View className="pb-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.forgotPassword.screenSubtitle')}
              </Text>
            </View>

            {/* Form Fields */}
            <View className="gap-md pt-md">
              <FormField
                control={control}
                name="mobileNumber"
                variant="mobile"
                label={t('auth.forgotPassword.mobileNumber')}
                placeholder={t('auth.forgotPassword.mobileNumberPlaceholder')}
                testID="forgot-password-mobile-input"
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{8,15}$/,
                    message: 'Mobile number must be 8-15 digits',
                  },
                }}
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
                testID="forgot-password-button"
              >
                {t('auth.forgotPassword.sendCode')}
              </Button>

              <Button
                variant="ghost"
                size="medium"
                onPress={() => navigation.navigate('Login')}
                fullWidth
                testID="back-to-login-button"
              >
                {t('auth.forgotPassword.backToLogin')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


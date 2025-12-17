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
import { s, vs, ms } from '@/utils/scale';
import { lightTheme, typography } from '@/styles/tokens';
import { Icon } from '@/components/icons';

type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

type ForgotPasswordFormData = {
  email: string;
};

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', {
        email: data.email,
      });

      showToast({ type: 'success', message: response.data.message || 'Code sent successfully' });
      
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { 
        mobileNumber: data.email, // Using email field for mobile number
        purpose: 'password-reset' 
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
    <View style={{ flex: 1, backgroundColor: lightTheme.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Status Bar Area - Design includes 46.15px status bar */}
          <View style={{ height: vs(46.15) }} />
          
          {/* Header */}
          <View 
            className="border-b border-theme-border"
            style={{ 
              paddingHorizontal: s(15.38), 
              paddingTop: s(15.38),
              paddingBottom: s(15.38) 
            }}
          >
            <View className="flex-row justify-between items-center">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: s(40),
                  height: s(40),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
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
          <View
            style={{
              flex: 1,
              backgroundColor: lightTheme.background,
              paddingHorizontal: ms(16),
              paddingTop: ms(16),
            }}
          >
            {/* Card Header */}
            <View style={{ paddingBottom: ms(8) }}>
              <Text
                style={{
                  fontSize: ms(28),
                  lineHeight: ms(32), // 28 * 1.142857
                  fontWeight: '400',
                  fontFamily: typography.h1.fontFamily,
                  color: lightTheme.textPrimary,
                }}
              >
                {t('auth.forgotPassword.title')}
              </Text>
            </View>

            {/* Subtitle */}
            <View style={{ paddingBottom: ms(16) }}>
              <Text
                style={{
                  fontSize: ms(14),
                  lineHeight: ms(17), // 14 * 1.2142857142857142
                  fontWeight: '400',
                  fontFamily: typography.bodySmall.fontFamily,
                  color: lightTheme.textSecondary,
                }}
              >
                {t('auth.forgotPassword.screenSubtitle')}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={{ gap: ms(16), paddingTop: ms(16) }}>
              <FormField
                control={control}
                name="email"
                variant="mobile"
                label={t('auth.forgotPassword.mobileNumber')}
                placeholder={t('auth.forgotPassword.mobileNumberPlaceholder')}
                testID="forgot-password-mobile-input"
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{8,15}$/,
                    message: 'mobile number is invalid',
                  },
                }}
              />
            </View>

            {/* Buttons */}
            <View
              style={{
                gap: ms(8),
                paddingTop: ms(16),
                paddingBottom: ms(16),
              }}
            >
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


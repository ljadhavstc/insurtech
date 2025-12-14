/**
 * OTP Verification Screen
 * 
 * Screen for verifying OTP code sent to user's email.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { useToast } from '@/components/Toast';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { Spacer } from '@/components/primitives/Spacer';

type AuthStackParamList = {
  OTPVerification: { email: string };
  ResetPassword: { email: string; resetToken: string };
  ForgotPassword: { email?: string };
};

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

type OTPFormData = {
  otp: string;
};

export const OTPVerificationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const email = route.params?.email || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    defaultValues: {
      otp: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: OTPFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/otp-verify', {
        email,
        otp: data.otp,
      });

      showToast({ type: 'success', message: response.data.message || 'OTP verified successfully' });
      
      // Navigate to reset password screen
      navigation.navigate('ResetPassword', {
        email,
        resetToken: response.data.resetToken,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Invalid OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      showToast({ type: 'success', message: 'OTP resent to your email' });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to resend OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box className="flex-1 justify-center px-6" p={24}>
          <Text variant="h1" className="text-theme-text-primary mb-2">
            {t('auth.otpVerification.title')}
          </Text>
          <Text variant="body" className="text-theme-text-secondary mb-8">
            {t('auth.otpVerification.subtitle')}
          </Text>

          <FormField
            control={control}
            name="otp"
            label={t('auth.otpVerification.otp')}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            testID="otp-input"
            rules={{
              required: 'OTP is required',
              minLength: {
                value: 6,
                message: 'Please enter a valid 6-digit OTP',
              },
              maxLength: {
                value: 6,
                message: 'Please enter a valid 6-digit OTP',
              },
            }}
          />
          <Spacer height={24} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            testID="verify-otp-button"
          >
            {t('auth.otpVerification.verify')}
          </Button>
          <Spacer height={16} />

          <Text
            variant="bodySmall"
            className="text-primary text-center"
            onPress={handleResend}
          >
            {t('auth.otpVerification.resend')}
          </Text>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


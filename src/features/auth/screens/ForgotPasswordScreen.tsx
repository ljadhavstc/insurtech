/**
 * Forgot Password Screen
 * 
 * Screen for requesting password reset OTP.
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
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ForgotPassword'>;

type ForgotPasswordFormData = {
  email: string;
};

export const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const route = useRoute<ForgotPasswordScreenRouteProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: route.params?.email || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', {
        email: data.email,
      });

      showToast({ type: 'success', message: response.data.message || 'OTP sent to your email' });
      
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', { email: data.email });
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
            {t('auth.forgotPassword.title')}
          </Text>
          <Text variant="body" className="text-theme-text-secondary mb-8">
            {t('auth.forgotPassword.subtitle')}
          </Text>

          <FormField
            control={control}
            name="email"
            label={t('auth.forgotPassword.email')}
            placeholder={t('auth.forgotPassword.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="forgot-password-email-input"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email',
              },
            }}
          />
          <Spacer height={24} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            testID="forgot-password-button"
          >
            {t('auth.forgotPassword.sendOTP')}
          </Button>
          <Spacer height={16} />

          <Text
            variant="bodySmall"
            className="text-primary text-center"
            onPress={() => navigation.navigate('Login')}
          >
            {t('auth.forgotPassword.backToLogin')}
          </Text>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


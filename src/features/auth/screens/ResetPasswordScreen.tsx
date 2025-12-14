/**
 * Reset Password Screen
 * 
 * Screen for resetting password after OTP verification.
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
  ResetPassword: { email: string; resetToken: string };
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
  const { email, resetToken } = route.params;

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
    mode: 'onBlur',
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', {
        email,
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
            {t('auth.resetPassword.title')}
          </Text>
          <Text variant="body" className="text-theme-text-secondary mb-8">
            {t('auth.resetPassword.subtitle')}
          </Text>

          <FormField
            control={control}
            name="newPassword"
            label={t('auth.resetPassword.newPassword')}
            placeholder={t('auth.resetPassword.newPassword')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            testID="reset-password-new-input"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
          />
          <Spacer height={16} />

          <FormField
            control={control}
            name="confirmPassword"
            label={t('auth.resetPassword.confirmPassword')}
            placeholder={t('auth.resetPassword.confirmPassword')}
            secureTextEntry
            autoCapitalize="none"
            testID="reset-password-confirm-input"
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === newPassword || 'Passwords do not match',
            }}
          />
          <Spacer height={24} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            testID="reset-password-button"
          >
            {t('auth.resetPassword.reset')}
          </Button>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


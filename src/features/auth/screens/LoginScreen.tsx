/**
 * Login Screen
 * 
 * User login screen with email and password fields.
 * Uses react-hook-form for validation.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { authStore } from '@/stores/authStore';
import { useToast } from '@/components/Toast';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { Spacer } from '@/components/primitives/Spacer';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const login = authStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token, refreshToken } = response.data;
      login(user, token, refreshToken);
      
      showToast({ type: 'success', message: 'Login successful!' });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Login failed',
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
            {t('auth.login.title')}
          </Text>
          <Text variant="body" className="text-theme-text-secondary mb-8">
            {t('auth.login.subtitle')}
          </Text>

          <FormField
            control={control}
            name="email"
            label={t('auth.login.email')}
            placeholder={t('auth.login.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="login-email-input"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email',
              },
            }}
          />
          <Spacer height={16} />

          <FormField
            control={control}
            name="password"
            label={t('auth.login.password')}
            placeholder={t('auth.login.password')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            testID="login-password-input"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
          />
          <Spacer height={8} />

          <Text
            variant="bodySmall"
            className="text-primary text-right"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            {t('auth.login.forgotPassword')}
          </Text>
          <Spacer height={24} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            testID="login-button"
          >
            {t('auth.login.loginButton')}
          </Button>
          <Spacer height={16} />

          <Box className="flex-row justify-center items-center">
            <Text variant="bodySmall" className="text-theme-text-secondary">
              {t('auth.login.noAccount')}{' '}
            </Text>
            <Text
              variant="bodySmall"
              className="text-primary font-semibold"
              onPress={() => navigation.navigate('Register')}
            >
              {t('auth.login.signUp')}
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


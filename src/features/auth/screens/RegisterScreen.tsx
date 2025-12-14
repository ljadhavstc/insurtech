/**
 * Register Screen
 * 
 * User registration screen with name, email, password, and confirm password fields.
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
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const login = authStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const { user, token, refreshToken } = response.data;
      login(user, token, refreshToken);
      
      showToast({ type: 'success', message: 'Registration successful!' });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Registration failed',
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
            {t('auth.register.title')}
          </Text>
          <Text variant="body" className="text-theme-text-secondary mb-8">
            {t('auth.register.subtitle')}
          </Text>

          <FormField
            control={control}
            name="name"
            label={t('auth.register.name')}
            placeholder={t('auth.register.name')}
            autoCapitalize="words"
            testID="register-name-input"
            rules={{
              required: 'Name is required',
            }}
          />
          <Spacer height={16} />

          <FormField
            control={control}
            name="email"
            label={t('auth.register.email')}
            placeholder={t('auth.register.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="register-email-input"
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
            label={t('auth.register.password')}
            placeholder={t('auth.register.password')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            testID="register-password-input"
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
            label={t('auth.register.confirmPassword')}
            placeholder={t('auth.register.confirmPassword')}
            secureTextEntry
            autoCapitalize="none"
            testID="register-confirm-password-input"
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            }}
          />
          <Spacer height={24} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            fullWidth
            testID="register-button"
          >
            {t('auth.register.registerButton')}
          </Button>
          <Spacer height={16} />

          <Box className="flex-row justify-center items-center">
            <Text variant="bodySmall" className="text-theme-text-secondary">
              {t('auth.register.haveAccount')}{' '}
            </Text>
            <Text
              variant="bodySmall"
              className="text-primary font-semibold"
              onPress={() => navigation.navigate('Login')}
            >
              {t('auth.register.signIn')}
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


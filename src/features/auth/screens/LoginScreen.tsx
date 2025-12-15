/**
 * Login Screen
 * 
 * User login screen matching Figma design.
 * Uses phone number and password fields with react-hook-form for validation.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '@/services/api';
import { authStore } from '@/stores/authStore';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/form/FormField';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { s, vs, ms } from '@/utils/scale';
import { lightTheme, typography } from '@/styles/tokens';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type LoginFormData = {
  phoneNumber: string;
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
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const phoneNumber = watch('phoneNumber');
  const password = watch('password');
  const isFormValid = phoneNumber && password && password.length >= 8;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        phoneNumber: data.phoneNumber,
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
                <Text
                  style={{
                    fontSize: s(24),
                    color: lightTheme.textPrimary,
                  }}
                >
                  ←
                </Text>
              </TouchableOpacity>
              
              {/* Title */}
              <Text variant="onboardingHeader" className="text-theme-text-primary">
                Login
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
                {t('auth.login.title')}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={{ gap: ms(16), paddingTop: ms(16) }}>
              <FormField
                control={control}
                name="phoneNumber"
                label={t('auth.login.phoneNumber')}
                placeholder="eg. 33011234"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoComplete="tel"
                testID="login-phone-input"
                rules={{
                  required: t('auth.login.phoneRequired'),
                }}
              />

              <FormField
                control={control}
                name="password"
                label={t('auth.login.password')}
                placeholder="enter password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                testID="login-password-input"
                rules={{
                  required: t('auth.login.passwordRequired'),
                  minLength: {
                    value: 8,
                    message: t('auth.login.passwordMinLength'),
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
                testID="login-button"
              >
                {t('auth.login.loginButton')}
              </Button>

              <Button
                variant="ghost"
                size="medium"
                onPress={() => navigation.navigate('ForgotPassword')}
                fullWidth
                testID="forgot-password-button"
              >
                {t('auth.login.forgotPassword')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


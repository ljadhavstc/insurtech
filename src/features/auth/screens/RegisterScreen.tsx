/**
 * Register Screen
 * 
 * Registration flow entry point that navigates through:
 * 1. Mobile number input (reusable MobileNumberInputScreen)
 * 2. OTP verification (reusable OTPVerificationScreen)
 * 3. Password setup (reusable PasswordSetupScreen)
 * 4. Success screen
 * 
 * This screen immediately navigates to MobileNumberInput with registration config.
 * The actual registration flow is handled by the reusable screens.
 */

import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MobileNumberInputScreenConfig } from './MobileNumberInputScreen';

type AuthStackParamList = {
  Register: undefined;
  MobileNumberInput: { config: MobileNumberInputScreenConfig };
  Login: undefined;
  [key: string]: any;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Configure the mobile number input screen for registration
  const config: MobileNumberInputScreenConfig = {
    purpose: 'registration',
    screenTitle: 'account registration',
    title: 'enter your number',
    subtitle: 'enter your number to create account.',
    buttonText: 'continue',
  };

  // Navigate to mobile number input screen with registration config
  useEffect(() => {
    // Use replace to prevent back navigation to this empty screen
    navigation.replace('MobileNumberInput', { config });
  }, [navigation]);

  // This screen doesn't render anything - it immediately navigates
  // The actual UI is handled by MobileNumberInputScreen
  return null;
};

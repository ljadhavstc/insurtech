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

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { MobileNumberInputScreenConfig } from './MobileNumberInputScreen';
import { 
  getCurrentRegistrationStep, 
  getStepData, 
  isRegistrationInProgress 
} from '@/services/registrationStepService';

type AuthStackParamList = {
  Register: undefined;
  MobileNumberInput: { config: MobileNumberInputScreenConfig };
  Login: undefined;
  [key: string]: any;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [checking, setChecking] = useState(true);

  // Check for existing registration and resume from last step
  useEffect(() => {
    const checkAndResumeRegistration = async () => {
      try {
        const inProgress = await isRegistrationInProgress();
        
        if (inProgress) {
          const currentStep = await getCurrentRegistrationStep();
          const stepData = currentStep ? await getStepData(currentStep) : null;
          
          // Resume from the appropriate step based on current step
          switch (currentStep) {
            case 'mobile-input':
              // Resume at OTP verification
              navigation.replace('OTPVerification', {
                mobileNumber: stepData?.mobileNumber,
                purpose: 'registration',
              });
              break;
            case 'otp-verification':
              // Resume at password setup
              navigation.replace('PasswordSetup', {
                config: {
                  purpose: 'registration',
                  mobileNumber: stepData?.mobileNumber,
                  email: stepData?.email,
                  resetToken: stepData?.resetToken,
                },
              });
              break;
            case 'password-setup':
              // Resume at email input
              navigation.replace('EmailInput', {
                mobileNumber: stepData?.mobileNumber,
                password: stepData?.password,
                resetToken: stepData?.resetToken,
              });
              break;
            case 'email-input':
              // Resume at CPR verification
              navigation.replace('StartVerification');
              break;
            case 'cpr-verification':
              // Resume at verification progress
              navigation.replace('VerificationProgress');
              break;
            default:
              // Start from beginning
              startNewRegistration();
          }
        } else {
          // Start new registration
          startNewRegistration();
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        startNewRegistration();
      } finally {
        setChecking(false);
      }
    };

    const startNewRegistration = () => {
      const config: MobileNumberInputScreenConfig = {
        purpose: 'registration',
        screenTitle: 'account registration',
        title: 'enter your number',
        subtitle: 'enter your number to create account.',
        buttonText: 'continue',
      };
      navigation.replace('MobileNumberInput', { config });
    };

    checkAndResumeRegistration();
  }, [navigation]);

  // Show loading while checking registration status
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This screen doesn't render anything - it immediately navigates
  return null;
};

/**
 * Verification Progress Screen
 * 
 * Shows 3-step verification process with loading indicators.
 * Each step shows loading initially, then green tick when completed.
 * Uses mock server to simulate step completion (3 seconds per step).
 * In production, will check Jumio API for actual verification status.
 * 
 * Follows exact Figma design with card-based steps and proper design tokens.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs, s, ms } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme, baseColors } from '@/styles/tokens';
import { Icon } from '@/components/icons';
import { CheckCircle } from '@/components/icons/CheckCircle';

type AuthStackParamList = {
  VerificationProgress: undefined;
  Success: { message?: string };
  Home: undefined;
  [key: string]: any;
};

type VerificationProgressScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerificationProgress'>;

export type VerificationStep = {
  id: string;
  title: string;
  status: 'pending' | 'loading' | 'completed' | 'failed';
};

const VERIFICATION_STEPS: Omit<VerificationStep, 'status'>[] = [
  {
    id: 'personal',
    title: 'personal information',
  },
  {
    id: 'additional',
    title: 'additional information',
  },
  {
    id: 'final',
    title: 'final checks',
  },
];

export const VerificationProgressScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<VerificationProgressScreenNavigationProp>();
  const { showToast } = useToast();
  const { isLandscape } = useScreenDimensions();

  const [steps, setSteps] = useState<VerificationStep[]>(
    VERIFICATION_STEPS.map((step, index) => ({ 
      ...step, 
      status: index === 0 ? 'completed' : index === 1 ? 'loading' : 'pending' 
    }))
  );
  const [isComplete, setIsComplete] = useState(false);

  // Simulate step completion (mock - will be replaced with Jumio API check)
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Step 1 is already completed
    // Complete step 2 after 3 seconds
    const timer2 = setTimeout(() => {
      setSteps(prevSteps => {
        const updated = [...prevSteps];
        updated[1] = { ...updated[1], status: 'completed' };
        updated[2] = { ...updated[2], status: 'loading' };
        return updated;
      });
    }, 3000);

    // Complete step 3 after 6 seconds
    const timer3 = setTimeout(() => {
      setSteps(prevSteps => {
        const updated = [...prevSteps];
        updated[2] = { ...updated[2], status: 'completed' };
        setIsComplete(true);
        return updated;
      });
    }, 6000);

    timers.push(timer2, timer3);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const renderStepIcon = (step: VerificationStep) => {
    if (step.status === 'completed') {
      return (
        <View 
          className="items-center justify-center rounded-full"
          style={{ 
            width: s(24),
            height: s(24),
            backgroundColor: lightTheme.backgroundTertiary, // Light grey circle
          }}
        >
          <CheckCircle 
            width={s(16)} 
            height={s(16)} 
            color={baseColors.successAccent} // Green checkmark
          />
        </View>
      );
    } else if (step.status === 'loading') {
      return (
        <View 
          className="items-center justify-center rounded-full"
          style={{ 
            width: s(24),
            height: s(24),
            backgroundColor: lightTheme.backgroundTertiary, // Light grey circle
          }}
        >
          <ActivityIndicator 
            size="small" 
            color={lightTheme.textTertiary} // Light grey spinner
          />
        </View>
      );
    } else {
      // Pending
      return (
        <View 
          className="items-center justify-center rounded-full"
          style={{ 
            width: s(24),
            height: s(24),
            backgroundColor: lightTheme.backgroundTertiary, // Light grey circle
          }}
        >
          <ActivityIndicator 
            size="small" 
            color={lightTheme.textTertiary} // Light grey spinner
          />
        </View>
      );
    }
  };

  const handleHomePress = () => {
    // Navigate to home/main app
    navigation.navigate('Home');
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
                {t('auth.verification.progressScreenTitle', 'ID Verification')}
              </Text>

              {/* Language Dropdown */}
              <LanguageDropdown />
            </View>
          </View>

          {/* Content Card */}
          <View className="flex-1 bg-theme-background px-md pt-md">
            {isComplete ? (
              // Success State - Show success icon and message
              <>
                {/* Success Icon Container - Centered */}
                <View className="items-center mb-lg">
                  {/* Outer box - 104x104 with light green bg */}
                  <View 
                    style={{
                      width: ms(104),
                      height: ms(104),
                      backgroundColor: baseColors.successLight, // #E6F9F4
                      borderRadius: ms(8),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Inner box - 48x48 with 1px border */}
                    <View 
                      style={{
                        width: ms(48),
                        height: ms(48),
                        borderWidth: 1,
                        borderColor: baseColors.successAccent, // #14B861
                        borderRadius: ms(8),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Check icon */}
                      <CheckCircle 
                        color={baseColors.successAccent}
                        width={ms(24)}
                        height={ms(24)}
                      />
                    </View>
                  </View>
                </View>

                {/* Success Title */}
                <View className="pb-xs items-center">
                  <Text variant="screenTitle" className="text-theme-text-primary text-center">
                {t('auth.verification.successTitle', 'registration successful')}
              </Text>
            </View>

            {/* Success Subtitle */}
            <View className="pb-md items-center">
              <Text variant="bodySmall" className="text-theme-text-secondary text-center">
                {t('auth.verification.successSubtitle', 'your account has been set up and is ready to use.')}
              </Text>
            </View>
              </>
            ) : (
              // Progress State - Show progress title and subtitle
              <>
                {/* Card Header */}
                <View className="pb-xs">
                  <Text variant="screenTitle" className="text-theme-text-primary">
                    {t('auth.verification.progressTitle', 'setting up your account')}
                  </Text>
                </View>

                {/* Subtitle */}
                <View className="pb-md">
                  <Text variant="bodySmall" className="text-theme-text-secondary">
                    {t('auth.verification.progressSubtitle', 'verifying your details, this should take under 2 mins.')}
                  </Text>
                </View>
              </>
            )}

            {/* Steps - Card-based layout (always visible) */}
            <View className="gap-md pt-md">
              {steps.map((step) => (
                <View 
                  key={step.id}
                  className="flex-row items-center justify-between p-md rounded-lg"
                  style={{ 
                    backgroundColor: lightTheme.background, // White background
                    borderWidth: 1,
                    borderColor: lightTheme.borderLight, // Light grey border
                  }}
                >
                  {/* Step Title */}
                  <Text variant="body" className="text-theme-text-primary flex-1">
                    {t(`auth.verification.step${step.id.charAt(0).toUpperCase() + step.id.slice(1)}Title`, step.title)}
                  </Text>

                  {/* Step Icon - Always show checkmark when completed */}
                  {step.status === 'completed' ? (
                    <View 
                      className="items-center justify-center rounded-full"
                      style={{ 
                        width: s(24),
                        height: s(24),
                        backgroundColor: lightTheme.backgroundTertiary, // Light grey circle
                      }}
                    >
                      <CheckCircle 
                        width={s(16)} 
                        height={s(16)} 
                        color={baseColors.successAccent} // Green checkmark
                      />
                    </View>
                  ) : (
                    renderStepIcon(step)
                  )}
                </View>
              ))}
            </View>

            {/* Spacer */}
            <View className="flex-1" />
          </View>
        </ScrollView>

        {/* Footer Button - Fixed at bottom */}
        <View className="px-md pb-md" style={{ paddingTop: vs(16) }}>
          <Button
            variant="solid"
            size="medium"
            onPress={handleHomePress}
            fullWidth
            testID="home-button"
          >
            {t('auth.verification.homeButton', 'home')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

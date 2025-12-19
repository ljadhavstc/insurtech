/**
 * Start Verification Screen
 * 
 * Screen to initiate identity verification process.
 * Follows exact Figma design with white background and all elements.
 * On "Start Verification" button click, triggers Jumio integration (to be implemented).
 * After user data capture, navigates to VerificationProgressScreen.
 */

import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { LanguageDropdown } from '@/components/LanguageDropdown';
import { vs, s } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { lightTheme, brandColors } from '@/styles/tokens';
import { Icon } from '@/components/icons';

type AuthStackParamList = {
  StartVerification: undefined;
  VerificationProgress: undefined;
  Success: { message?: string };
  [key: string]: any;
};

type StartVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'StartVerification'>;

// Scan Frame Component - Purple L-shaped brackets
const ScanFrame: React.FC<{ placeholderText?: string }> = ({ placeholderText = 'Position your CPR card here' }) => {
  const cornerSize = 20;
  const strokeWidth = 3;
  const color = brandColors.purple;

  return (
    <View className="w-full items-center justify-center" style={{ minHeight: 200 }}>
      <View 
        className="relative border-2 rounded-lg"
        style={{ 
          borderColor: color,
          borderWidth: strokeWidth,
          borderRadius: 12,
          width: '90%',
          aspectRatio: 1.6,
          backgroundColor: lightTheme.backgroundSecondary,
        }}
      >
        {/* Top-left corner bracket */}
        <View
          style={{
            position: 'absolute',
            top: -strokeWidth,
            left: -strokeWidth,
            width: cornerSize,
            height: cornerSize,
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            borderTopLeftRadius: 8,
          }}
        />
        {/* Top-right corner bracket */}
        <View
          style={{
            position: 'absolute',
            top: -strokeWidth,
            right: -strokeWidth,
            width: cornerSize,
            height: cornerSize,
            borderTopWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            borderTopRightRadius: 8,
          }}
        />
        {/* Bottom-left corner bracket */}
        <View
          style={{
            position: 'absolute',
            bottom: -strokeWidth,
            left: -strokeWidth,
            width: cornerSize,
            height: cornerSize,
            borderBottomWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            borderBottomLeftRadius: 8,
          }}
        />
        {/* Bottom-right corner bracket */}
        <View
          style={{
            position: 'absolute',
            bottom: -strokeWidth,
            right: -strokeWidth,
            width: cornerSize,
            height: cornerSize,
            borderBottomWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            borderBottomRightRadius: 8,
          }}
        />
        
        {/* Placeholder for ID card image */}
        <View className="flex-1 items-center justify-center p-4">
          <Text variant="bodySmall" className="text-theme-text-tertiary text-center">
            {placeholderText}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Valid CPR Info Box Component
const ValidCPRBox: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View 
      className="flex-row items-center p-md rounded-lg gap-md"
      style={{ backgroundColor: lightTheme.backgroundTertiary }}
    >
      {/* Purple icon placeholder - document with person */}
      <View 
        className="items-center justify-center rounded"
        style={{ 
          width: 40,
          height: 40,
          backgroundColor: brandColors.purple,
        }}
      >
        <Text className="text-white text-lg">📄</Text>
      </View>
      
      <Text variant="body" className="text-theme-text-primary">
        {t('auth.verification.validCPR', 'valid CPR')}
      </Text>
    </View>
  );
};

// Security Message Component
const SecurityMessage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <View className="flex-row items-center justify-center gap-xs pt-xs">
      <Text className="text-theme-text-tertiary text-xs">🔒</Text>
      <Text variant="caption" className="text-theme-text-tertiary text-center">
        {t('auth.verification.securityMessage', 'your information will be encrypted and stored securely')}
      </Text>
    </View>
  );
};

export const StartVerificationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StartVerificationScreenNavigationProp>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isLandscape } = useScreenDimensions();

  const handleStartVerification = async () => {
    try {
      setLoading(true);

      // TODO: Trigger Jumio integration here
      // For now, we'll simulate the process
      // In the future, this will:
      // 1. Initialize Jumio SDK
      // 2. Capture user data (ID document, selfie, etc.)
      // 3. Submit to Jumio for verification
      
      // Simulate user data capture delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to verification progress screen
      navigation.navigate('VerificationProgress');
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.message || 'Failed to start verification',
      });
    } finally {
      setLoading(false);
    }
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
          {/* Status Bar Area */}
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
              
              {/* Title - Centered */}
              <Text variant="onboardingHeader" className="text-theme-text-primary">
                {t('auth.verification.startScreenTitle', 'identity verification')}
              </Text>

              {/* Spacer to balance back button */}
              <View className="w-10 h-10" />
            </View>
          </View>

          {/* Main Content */}
          <View className="flex-1 px-md pt-md">
            {/* Primary Title */}
            <View className="pb-xs">
              <Text variant="screenTitle" className="text-theme-text-primary">
                {t('auth.verification.startTitle', 'verifying your identity')}
              </Text>
            </View>

            {/* Subtitle */}
            <View className="pb-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.verification.startSubtitle', 'ensure to have your valid CPR with you')}
              </Text>
            </View>

            {/* ID Card Scan Frame */}
            <View className="pb-md">
              <ScanFrame placeholderText={t('auth.verification.scanPlaceholder', 'Position your CPR card here')} />
            </View>

            {/* Valid CPR Info Box */}
            <View className="pb-md">
              <ValidCPRBox />
            </View>

            {/* Description Text */}
            <View className="pb-md">
              <Text variant="bodySmall" className="text-theme-text-secondary">
                {t('auth.verification.cprDescription', 'CPR helps us verify your identity and protect you from identity theft')}
              </Text>
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Button */}
            <View className="pb-md">
              <Button
                variant="solid"
                size="medium"
                onPress={handleStartVerification}
                loading={loading}
                fullWidth
                testID="start-verification-button"
              >
                {t('auth.verification.startButton', 'start verification')}
              </Button>
              
              {/* Security Message */}
              <SecurityMessage />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

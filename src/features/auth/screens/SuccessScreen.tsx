/**
 * Success Screen
 * 
 * Success screen shown after successful operations (e.g., password reset).
 * Displays success message with checkmark icon and redirects to login.
 * Matches Figma design with centered content and bottom login button.
 */

import React from 'react';
import { View, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { CheckCircle } from '@/components/icons/CheckCircle';
import { lightTheme, baseColors } from '@/styles/tokens';
import { ms } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';

type AuthStackParamList = {
  Success: { message?: string; isError?: boolean; errorStatus?: string };
  Login: undefined;
  Register: undefined;
};

type SuccessScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Success'>;
type SuccessScreenRouteProp = RouteProp<AuthStackParamList, 'Success'>;

export const SuccessScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SuccessScreenNavigationProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { isLandscape } = useScreenDimensions(); // Get orientation for responsive adjustments

  const { message, isError, errorStatus } = route.params || {};
  const isErrorState = isError === true || errorStatus === 'error';
  const isCustomerNotFound = isErrorState && message?.toLowerCase().includes('customer not found');

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  // Responsive sizes - orientation-aware
  const outerBoxSize = ms(104);
  const innerBoxSize = ms(48);
  const iconSize = ms(24);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      
      {/* Main Content - Centered */}
      <View className="flex-1 items-center justify-center px-md">
        {isErrorState ? (
          <>
            {/* Error Icon Container */}
            <View className="mb-lg items-center">
              {/* Outer box - 104x104 with light red bg */}
              <View 
                style={{
                  width: outerBoxSize,
                  height: outerBoxSize,
                  backgroundColor: baseColors.errorLight,
                  borderRadius: ms(52),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: baseColors.error,
                }}
              >
                {/* Error X icon */}
                <Text className="text-error" style={{ fontSize: ms(48), fontWeight: 'bold' }}>
                  ✕
                </Text>
              </View>
            </View>

            {/* Error Message */}
            <View className="px-lg mb-lg">
              <Text variant="body" className="text-theme-text-primary text-center">
                {message || 'An error occurred'}
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Success Icon Container */}
            <View className="mb-lg items-center">
              {/* Outer box - 104x104 with light green bg */}
              <View 
                style={{
                  width: outerBoxSize,
                  height: outerBoxSize,
                  backgroundColor: baseColors.successLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Inner box - 48x48 with 1px border */}
                <View 
                  style={{
                    width: innerBoxSize,
                    height: innerBoxSize,
                    borderWidth: 1,
                    borderColor: baseColors.successAccent,
                    borderRadius: ms(8),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Check icon */}
                  <CheckCircle 
                    color={baseColors.successAccent}
                    width={iconSize}
                    height={iconSize}
                  />
                </View>
              </View>
            </View>

            {/* Success Title */}
            <View className="mb-sm items-center">
              <Text variant="screenTitle" className="text-theme-text-primary text-center lowercase">
                success
              </Text>
            </View>

            {/* Success Message */}
            <View className="px-lg">
              <Text variant="body" className="text-theme-text-base-secondary text-center lowercase">
                {message || 'your password has been updated successfully.  log in to continue.'}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Buttons - Fixed at Bottom */}
      <View 
        className="px-md gap-sm"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
      >
        {isErrorState && isCustomerNotFound ? (
          <>
            {/* Login Button */}
            <Button
              variant="solid"
              size="medium"
              onPress={handleLoginPress}
              fullWidth
              testID="error-login-button"
            >
              {t('auth.login.loginButton', 'Log in')}
            </Button>
            
            {/* Register Button */}
            <Button
              variant="ghost"
              size="medium"
              onPress={handleRegisterPress}
              fullWidth
              testID="error-register-button"
            >
              {t('auth.register.registerButton', 'Register')}
            </Button>
          </>
        ) : (
          <Button
            variant="solid"
            size="medium"
            onPress={handleLoginPress}
            fullWidth
            testID="success-login-button"
          >
            login
          </Button>
        )}
      </View>
    </View>
  );
};


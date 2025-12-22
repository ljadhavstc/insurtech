/**
 * Root Navigator
 * 
 * Main navigation setup with Auth Stack and App Stack.
 * Uses React Navigation Stack and Bottom Tabs.
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ScrollView, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { authStore } from '@/stores/authStore';
import { SplashScreen } from '@/features/splash/screens/SplashScreen';
import { OnboardingScreen } from '@/features/onboarding/screens/OnboardingScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/features/auth/screens/ResetPasswordScreen';
import { OTPVerificationScreen } from '@/features/auth/screens/OTPVerificationScreen';
import { SuccessScreen } from '@/features/auth/screens/SuccessScreen';
import { MobileNumberInputScreen } from '@/features/auth/screens/MobileNumberInputScreen';
import { PasswordSetupScreen } from '@/features/auth/screens/PasswordSetupScreen';
import { EmailInputScreen } from '@/features/auth/screens/EmailInputScreen';
import { StartVerificationScreen } from '@/features/auth/screens/StartVerificationScreen';
import { VerificationProgressScreen } from '@/features/auth/screens/VerificationProgressScreen';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/primitives/Button';
import { 
  checkBiometricAvailability, 
  enableBiometric, 
  disableBiometric,
  isBiometricEnabled,
  getBiometricName,
  updateBiometricCredentials 
} from '@/services/biometricService';
import api from '@/services/api';
import { lightTheme, baseColors } from '@/styles/tokens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder Home Screen
const HomeScreen = () => {
  const user = authStore((state) => state.user);
  
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-h2 text-text-primary mb-4">Welcome!</Text>
      <Text className="text-body text-text-secondary">
        Logged in as: {user?.email}
      </Text>
    </View>
  );
};

// Profile Screen with Biometric Settings
const ProfileScreen = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user, logout, token } = authStore();
  const setBiometricEnabled = authStore((state) => state.setBiometricEnabled);
  const biometricEnabled = authStore((state) => state.biometricEnabled);
  
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const [availability, enabled] = await Promise.all([
          checkBiometricAvailability(),
          isBiometricEnabled(),
        ]);
        
        setBiometricAvailable(availability.available);
        setIsEnabled(enabled);
        
        if (availability.available && availability.biometryType) {
          setBiometricType(getBiometricName(availability.biometryType));
        }
      } catch (error) {
        setBiometricAvailable(false);
        setIsEnabled(false);
      } finally {
        setChecking(false);
      }
    };
    checkBiometric();
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    if (!biometricAvailable) {
      showToast({
        type: 'error',
        message: t('auth.biometric.notAvailable', 'Biometric authentication is not available on this device'),
      });
      return;
    }

    try {
      setLoading(true);

      if (value) {
        // Enable biometric - need to get current password
        // For now, we'll prompt user to re-enter password or use stored credentials
        // In a real app, you might want to show a password input modal
        showToast({
          type: 'info',
          message: t('auth.biometric.needPassword', 'Please log out and log in again to enable biometric login'),
        });
        setIsEnabled(false);
      } else {
        // Disable biometric
        const result = await disableBiometric();
        if (result.success) {
          setIsEnabled(false);
          setBiometricEnabled(false);
          showToast({
            type: 'success',
            message: t('auth.biometric.disabled', 'Biometric login disabled'),
          });
        } else {
          showToast({
            type: 'error',
            message: result.error || t('auth.biometric.disableFailed', 'Failed to disable biometric login'),
          });
        }
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.message || t('auth.biometric.toggleFailed', 'Failed to toggle biometric login'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-theme-background">
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* User Info */}
        <View className="mb-6">
          <Text className="text-h2 text-theme-text-primary mb-2">Profile</Text>
          <Text className="text-body text-theme-text-secondary">
            {user?.email || user?.id}
          </Text>
        </View>

        {/* Biometric Settings */}
        {!checking && (
          <View className="mb-6">
            <Text className="text-h3 text-theme-text-primary mb-4">
              {t('auth.biometric.settings', 'Security Settings')}
            </Text>
            
            {biometricAvailable ? (
              <View className="border border-theme-border rounded-sm bg-theme-background p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1 pr-3">
                    <Text className="text-body text-theme-text-primary mb-1">
                      {t('auth.biometric.enableTitle', { type: biometricType })}
                    </Text>
                    <Text className="text-bodySmall text-theme-text-secondary">
                      {t('auth.biometric.enableDescription', { type: biometricType })}
                    </Text>
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={handleBiometricToggle}
                    disabled={loading}
                    trackColor={{ false: '#E5E7EB', true: baseColors.primary }}
                    thumbColor={isEnabled ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#E5E7EB"
                  />
                </View>
                
                {isEnabled && (
                  <Text className="text-bodySmall text-theme-text-secondary mt-2">
                    {t('auth.biometric.enabledMessage', { type: biometricType })}
                  </Text>
                )}
              </View>
            ) : (
              <View className="border border-theme-border rounded-sm bg-theme-background p-4">
                <Text className="text-body text-theme-text-secondary">
                  {t('auth.biometric.notAvailable', 'Biometric authentication is not available on this device')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Logout Button */}
        <View className="mt-4">
          <Button
            variant="ghost"
            size="medium"
            onPress={logout}
            fullWidth
          >
            {t('auth.logout', 'Logout')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

// App Tabs (shown when authenticated)
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0b69ff',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth Stack (shown when not authenticated)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Custom headers in screens
        gestureEnabled: true, // Enable gestures for back button
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MobileNumberInput" component={MobileNumberInputScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="PasswordSetup" component={PasswordSetupScreen} />
      <Stack.Screen name="EmailInput" component={EmailInputScreen} />
      <Stack.Screen name="StartVerification" component={StartVerificationScreen} />
      <Stack.Screen name="VerificationProgress" component={VerificationProgressScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
};

// App Stack (shown when authenticated)
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable gestures
      }}
    >
      <Stack.Screen name="Main" component={AppTabs} />
    </Stack.Navigator>
  );
};

// Root Stack (includes Splash Screen)
const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="StartVerification" component={StartVerificationScreen} />
      <Stack.Screen name="VerificationProgress" component={VerificationProgressScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
};

// Root Navigator
export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};


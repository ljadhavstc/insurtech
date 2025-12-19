/**
 * Root Navigator
 * 
 * Main navigation setup with Auth Stack and App Stack.
 * Uses React Navigation Stack and Bottom Tabs.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { View, Text } from 'react-native';

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

// Placeholder Profile Screen
const ProfileScreen = () => {
  const { user, logout } = authStore();
  
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-h2 text-text-primary mb-4">Profile</Text>
      <Text className="text-body text-text-secondary mb-4">
        {user?.email}
      </Text>
      <Text
        className="text-primary underline"
        onPress={logout}
      >
        Logout
      </Text>
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


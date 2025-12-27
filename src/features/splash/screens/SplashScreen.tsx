/**
 * Splash Screen
 * 
 * Initial screen shown when app launches.
 * Displays for 3 seconds before navigating to the appropriate screen.
 * Uses Tailwind classes only - no StyleSheet.
 * Responsive design based on 390px base width (380-400px standard phone).
 */

import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '@/components/primitives/Text';
import { SplashLogo } from '@/components/splash/Logo';
import { authStore } from '@/stores/authStore';
import { s, vs } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';

type SplashScreenNavigationProp = StackNavigationProp<any>;

export const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const insets = useSafeAreaInsets();
  const { isLandscape } = useScreenDimensions(); // Orientation-aware responsive design

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } else {
        // Navigate to JUMIO Verification screen after splash
        navigation.reset({
          index: 0,
          routes: [{ name: 'JumioVerification' }],
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated]);

  return (
    <SafeAreaView className="flex-1 bg-brand-purple" edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F008C" translucent />
      <View className="flex-1 relative">
        {/* Main Content */}
        <View className="flex-1 relative">
          {/* Text Group - positioned based on Figma coordinates */}
          <View 
            className="absolute items-end"
            style={{
              left: s(132),
              top: vs(375), // y:375 from Figma (safe area handled by SafeAreaView)
              width: s(126),
              gap: vs(10),
            }}
          >
            <Text 
              variant="displayLarge"
              className="text-white text-center w-full"
            >
              name
            </Text>
            <Text 
              variant="bodyTight"
              className="text-white text-right w-full"
            >
              from stc
            </Text>
          </View>

          {/* Logo Component - positioned based on Figma coordinates */}
          <View 
            className="absolute"
            style={{
              left: s(188),
              top: vs(457.5), // y:457.5 from Figma (safe area handled by SafeAreaView)
            }}
          >
            <SplashLogo />
          </View>
        </View>

        {/* Footer Text */}
        <View 
          className="absolute items-center justify-center"
          style={{
            bottom: Math.max(insets.bottom, vs(52)),
            left: s(45),
            width: s(299),
          }}
        >
          <Text 
            variant="overline"
            className="text-white text-center"
          >
            stc Bahrain is an appointed representative of Solidarity and GIG Bahrain.
          </Text>
          <Text 
            variant="overline"
            className="text-white text-center font-medium"
          >
            V 0.01
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

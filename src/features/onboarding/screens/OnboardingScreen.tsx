/**
 * Onboarding Screen
 * 
 * Welcome/onboarding screen shown after splash screen.
 * Features horizontal image carousel in the middle section.
 * Uses Tailwind classes only - no StyleSheet.
 */

import React, { useEffect } from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { ImageCarousel, CarouselSlide } from '@/components/onboarding/ImageCarousel';
import { OnboardingImage1 } from '@/components/onboarding/OnboardingImage1';
import { OnboardingImage2 } from '@/components/onboarding/OnboardingImage2';
import { OnboardingImage3 } from '@/components/onboarding/OnboardingImage3';
import { s, vs, ms, getScreenDimensions, getOrientationAwareWidth, getBreakpoint, getOrientation, BREAKPOINTS } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { authStore } from '@/stores/authStore';

type OnboardingScreenNavigationProp = StackNavigationProp<any>;

// Carousel slides with SVG images
const carouselSlides: CarouselSlide[] = [
  {
    id: '1',
    image: <OnboardingImage1 width={s(150)} height={s(90)} />,
    title: 'get instant rewards',
    description: 'access 500+ partner discounts once you login',
  },
  {
    id: '2',
    image: <OnboardingImage2 width={s(120)} height={s(120)} />,
    title: 'manage your Policies',
    description: 'View,renew, and download your insurance instantly',
  },
  {
    id: '3',
    image: <OnboardingImage3 width={s(120)} height={s(120)} />,
    title: 'get help Faster',
    description: '24/7 support & claims assistance just a tap away',
  },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  
  // Check if user has logged in before
  const hasLoggedInBefore = authStore((state) => state.hasLoggedInBefore);

  // Get orientation-aware dimensions (updates on rotation)

  // Log dimensions for debugging (remove in production)
  
  const handleLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleRegister = () => {
    navigation.navigate('Auth', { screen: 'Register' });
  };

  return (
    <SafeAreaView className="flex-1 bg-theme-background" edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#4F008C" translucent />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Bar Area - Design includes 46.15px status bar */}
        <View style={{ height: vs(46.15) }} />
        
        {/* Header */}
        <View className="border-b border-theme-border px-[15.38px] pt-[15.38px] pb-[15.38px]">
          <View className="flex-row justify-between items-center">
            <View className="w-10 h-10" />
            <Text variant="onboardingHeader" className="text-theme-text-primary">
              get started
            </Text>
            <Text variant="onboardingHeader" className="text-brand-red">
              العربية
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View 
          className="flex-1"
          style={{
            paddingHorizontal: s(23), // onboardingContentPadding
            paddingTop: s(24),
            gap: s(36), // onboardingContentGap
          }}
        >
            {/* Title Section - Left aligned */}
            <View>
              <Text variant="onboardingTitle" className="text-brand-purple text-left">
                name
              </Text>
            </View>

            {/* Image Carousel */}
            <View className="flex-1 justify-center" style={{ minHeight: s(350) }}>
              <ImageCarousel slides={carouselSlides} />
            </View>

            {/* Subtitle and Description - Below carousel */}
            <View style={{ gap: s(8) }}>
              <Text variant="onboardingSubtitle" className="text-theme-text-primary text-left">
                welcome to product name
              </Text>
              <Text variant="onboardingDescription" className="text-theme-text-secondary text-left">
                one app to insure all your valuables
              </Text>
            </View>
          </View>

          {/* Debug Info - Remove in production */}
          {/* {__DEV__ && (
            <View className="px-md py-2 bg-gray-100 rounded-md mx-md mb-2">
              <Text variant="caption" className="text-gray-700 font-mono">
                📱 Screen: {screenWidth}px × {screenHeight}px{'\n'}
                📱 Orientation: {orientation.toUpperCase()}{'\n'}
                📊 Breakpoint: {breakpoint} {isBoxedLayout ? '(BOXED)' : '(SCALING)'}{'\n'}
                🔘 Button: {buttonWidth}px {isBoxedLayout ? '(FIXED)' : '(scaled from 343px)'} {isLandscape ? '(landscape)' : ''}{'\n'}
                📏 Margin: {marginEachSide.toFixed(1)}px each side{'\n'}
                📊 Scale: {scaleFactor.toFixed(3)}x
              </Text>
            </View>
          )} */}

          {/* Buttons Container - Separate from main content for proper centering */}
          <View 
            className="gap-sm px-md mt-10"
            style={{ 
              paddingBottom: Math.max(insets.bottom, s(16))
            }}
          >
            {hasLoggedInBefore ? (
              // User has logged in before: Login at top, Register at bottom
              <>
                <Button
                  onPress={handleLogin}
                  variant="solid"
                  size="medium"
                  fullWidth
                >
                  Log in
                </Button>
                
                <Button
                  onPress={handleRegister}
                  variant="ghost"
                  size="medium"
                  fullWidth
                >
                  Register
                </Button>
              </>
            ) : (
              // New user: Register at top, Login at bottom
              <>
                <Button
                  onPress={handleRegister}
                  variant="solid"
                  size="medium"
                  fullWidth
                >
                  Register
                </Button>
                
                <Button
                  onPress={handleLogin}
                  variant="ghost"
                  size="medium"
                  fullWidth
                >
                  Log in
                </Button>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

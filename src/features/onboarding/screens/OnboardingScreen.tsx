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
import { s, vs, ms, getScreenDimensions, getOrientationAwareWidth, getBreakpoint, getOrientation, BREAKPOINTS } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { authStore } from '@/stores/authStore';

type OnboardingScreenNavigationProp = StackNavigationProp<any>;

// Sample carousel slides - replace with actual images
const carouselSlides: CarouselSlide[] = [
  {
    id: '1',
    image: null, // Will be replaced with actual image component
    title: 'get instant rewards',
    description: 'access 500+ partner discounts once you login',
  },
  {
    id: '2',
    image: null,
    title: 'protect your valuables',
    description: 'comprehensive insurance coverage for all your needs',
  },
  {
    id: '3',
    image: null,
    title: 'easy claims process',
    description: 'file and track claims quickly and easily',
  },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  
  // Check if user has logged in before
  const hasLoggedInBefore = authStore((state) => state.hasLoggedInBefore);

  // Get orientation-aware dimensions (updates on rotation)
  const { width: screenWidth, height: screenHeight, orientation, isLandscape } = useScreenDimensions();
  const breakpoint = getBreakpoint();
  const buttonWidth = getOrientationAwareWidth(343, 428); // Orientation-aware responsive width
  const marginEachSide = (screenWidth - buttonWidth) / 2;
  const baseWidth = 390; // Design base width
  const scaleFactor = (screenWidth / baseWidth + screenHeight / 844) / 2; // ms() scale factor
  const isBoxedLayout = screenWidth > BREAKPOINTS.maxContentWidth;

  // Log dimensions for debugging (remove in production)
  useEffect(() => {
    console.log('📱 ===== RESPONSIVE DIMENSIONS =====');
    console.log(`📱 Screen Width: ${screenWidth}px`);
    console.log(`📱 Screen Height: ${screenHeight}px`);
    console.log(`📱 Orientation: ${orientation.toUpperCase()}`);
    console.log(`📱 Breakpoint: ${breakpoint} (${isBoxedLayout ? 'BOXED LAYOUT' : 'SCALING'})`);
    console.log(`📱 Base Design Width: ${baseWidth}px`);
    console.log(`📱 Max Content Width: ${BREAKPOINTS.maxContentWidth}px`);
    console.log(`📱 Scale Factor (ms): ${scaleFactor.toFixed(3)}`);
    console.log(`🔘 Button Width: ${buttonWidth}px ${isBoxedLayout ? '(FIXED - boxed)' : '(SCALED)'} ${isLandscape ? '(landscape-adjusted)' : ''}`);
    console.log(`📏 Margin Each Side: ${marginEachSide.toFixed(1)}px`);
    console.log(`📏 Total Margin: ${(marginEachSide * 2).toFixed(1)}px`);
    console.log(`✅ Button + Margins: ${(buttonWidth + marginEachSide * 2).toFixed(1)}px (should equal ${screenWidth}px)`);
    console.log('===================================');
  }, [screenWidth, screenHeight, buttonWidth, marginEachSide, scaleFactor, breakpoint, isBoxedLayout, orientation, isLandscape]);

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
        <View className="flex-1 px-6 pt-6 gap-9">
            {/* Title Section */}
            <View className="gap-8">
              <View className="items-center">
                <Text variant="onboardingTitle" className="text-brand-purple text-center">
                  name
                </Text>
              </View>

              <View className="gap-2">
                <Text variant="onboardingSubtitle" className="text-theme-text-primary">
                  welcome to product name
                </Text>
                <Text variant="onboardingDescription" className="text-theme-text-secondary">
                  one app to insure all your valuables
                </Text>
              </View>
            </View>

            {/* Image Carousel */}
            <View className="flex-1 justify-center">
              <ImageCarousel slides={carouselSlides} />
            </View>
          </View>

          {/* Debug Info - Remove in production */}
          {__DEV__ && (
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
          )}

          {/* Buttons Container - Separate from main content for proper centering */}
          <View 
            className="gap-sm px-md"
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

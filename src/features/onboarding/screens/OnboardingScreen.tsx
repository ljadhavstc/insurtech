/**
 * Onboarding Screen
 * 
 * Welcome/onboarding screen shown after splash screen.
 * Features horizontal image carousel in the middle section.
 * Uses Tailwind classes only - no StyleSheet.
 */

import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '@/components/primitives/Text';
import { Button } from '@/components/primitives/Button';
import { ImageCarousel, CarouselSlide } from '@/components/onboarding/ImageCarousel';
import { s, vs } from '@/utils/scale';

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
        <View 
          className="border-b border-theme-border"
          style={{ 
            paddingHorizontal: s(15.38), 
            paddingTop: s(15.38),
            paddingBottom: s(15.38) 
          }}
        >
          <View className="flex-row justify-between items-center">
            <View style={{ width: s(40), height: s(40) }} />
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
          className="flex-1 px-6"
          style={{ paddingTop: vs(24), gap: vs(36) }}
        >
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

            {/* Buttons */}
            <View 
              className="gap-2"
              style={{ 
                gap: s(8),
                paddingBottom: Math.max(insets.bottom, s(16))
              }}
            >
              <Button
                onPress={handleLogin}
                variant="primary"
                fullWidth
                className="bg-brand-red"
                style={{ height: s(48) }}
              >
                <Text variant="button" className="text-white lowercase">
                  Log in
                </Text>
              </Button>
              
              <Button
                onPress={handleRegister}
                variant="outline"
                fullWidth
                className="border border-brand-red bg-transparent"
                style={{ height: s(48) }}
              >
                <Text variant="button" className="text-brand-red lowercase">
                  Register
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

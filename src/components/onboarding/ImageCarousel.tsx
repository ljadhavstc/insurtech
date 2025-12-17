/**
 * Image Carousel Component
 * 
 * Horizontal scrolling carousel for onboarding images.
 * Includes pagination indicators.
 */

import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { s } from '@/utils/scale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = s(344);
const CARD_PADDING = s(36);

export interface CarouselSlide {
  id: string;
  image: any; // Image source or component
  title: string;
  description: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ slides }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="w-full">
      {/* Carousel Container */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="center"
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        }}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            className={`bg-theme-background-card border border-theme-border rounded-lg justify-center items-center ${index < slides.length - 1 ? 'mr-6' : ''}`}
            style={{
              width: CARD_WIDTH,
              height: s(350),
              padding: CARD_PADDING,
            }}
          >
            {/* Image Container */}
            <View 
              className="justify-center items-center"
              style={{ height: s(160), marginBottom: s(24) }}
            >
              {slide.image ? (
                typeof slide.image === 'string' ? (
                  <View 
                    className="bg-white rounded"
                    style={{ width: s(150), height: s(90) }}
                  >
                    {/* Placeholder for image - replace with actual Image component */}
                  </View>
                ) : (
                  slide.image
                )
              ) : (
                <View 
                  className="bg-white rounded"
                  style={{ width: s(150), height: s(90) }}
                >
                  {/* Placeholder - add image here */}
                </View>
              )}
            </View>

            {/* Text Content */}
            <View className="items-center gap-2" style={{ height: s(75) }}>
              <View className="w-full">
                <Text variant="onboardingSlideTitle" className="text-theme-text-primary text-center">
                  {slide.title}
                </Text>
              </View>
              <View className="w-full px-4">
                <Text variant="onboardingSlideDescription" className="text-theme-text-primary text-center">
                  {slide.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Indicators */}
      <View className="flex-row justify-center items-center gap-1.5 mt-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`rounded-full ${
              index === activeIndex 
                ? 'bg-theme-pagination-active' 
                : 'bg-theme-pagination-inactive'
            }`}
            style={{
              width: s(5),
              height: s(5),
            }}
          />
        ))}
      </View>
    </View>
  );
};

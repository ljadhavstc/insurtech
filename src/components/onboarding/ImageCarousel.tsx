/**
 * Image Carousel Component
 * 
 * Horizontal scrolling carousel for onboarding images.
 * Includes pagination indicators.
 */

import React, { useRef, useState } from 'react';
import { View, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { s, getOrientationAwareWidth } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';

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
  const { width: screenWidth } = useScreenDimensions(); // Orientation-aware responsive design
  
  // Card width: 344px scales up to 428px breakpoint, then stays fixed (boxed layout)
  // Orientation-aware: In landscape, uses height-based scaling to prevent cards from becoming too wide
  const cardWidth = getOrientationAwareWidth(344, 428);
  const cardPadding = s(36);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWidth);
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
        snapToInterval={cardWidth}
        snapToAlignment="center"
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - cardWidth) / 2,
        }}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            className={`bg-theme-background-card border border-theme-border rounded-lg justify-center items-center ${index < slides.length - 1 ? 'mr-6' : ''}`}
            style={{
              width: cardWidth,
              height: s(350),
              padding: cardPadding,
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

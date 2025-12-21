/**
 * Image Carousel Component
 * 
 * Horizontal scrolling carousel for onboarding images.
 * Includes pagination indicators.
 */

import React, { useRef, useState } from 'react';
import { View, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { s } from '@/utils/scale';
import { useScreenDimensions } from '@/utils/useScreenDimensions';
import { spacing } from '@/styles/tokens';

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
  
  // Card width: 344px exactly (from Figma design)
  const cardWidth = s(335);
  const cardPadding = s(spacing.onboardingCardPadding);

  const cardMargin = s(12);
  const cardWithMargin = cardWidth + cardMargin;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWithMargin);
    setActiveIndex(index);
  };

  return (
    <View className="w-full relative">
      {/* Carousel Container */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={cardWithMargin} // cardWidth + margin
        snapToAlignment="center"
        contentContainerStyle={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onMomentumScrollEnd={(event) => {
          // Auto-center the active card after scroll ends
          const scrollPosition = event.nativeEvent.contentOffset.x;
          const index = Math.round(scrollPosition / cardWithMargin);
          const newPosition = index * cardWithMargin;
          
          // Smoothly scroll to center the card
          scrollViewRef.current?.scrollTo({
            x: newPosition,
            animated: true,
          });
        }}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            className="bg-theme-background-card border border-theme-border justify-center items-center"
            style={{
              width: cardWidth,
              height: s(338),
              padding: cardPadding,
              borderRadius: 0,
              marginRight: index < slides.length - 1 ? cardMargin : 0,
            }}
          >
            {/* Image Container */}
            <View 
              className="justify-center items-center"
              style={{ height: s(160), marginBottom: s(spacing.onboardingCardGap) }}
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
                  <View className="justify-center items-center">
                    {slide.image}
                  </View>
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

            {/* Pagination Indicators - Inside each card at the bottom */}
            <View 
              className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center" 
              style={{ 
                gap: s(spacing.onboardingPaginationGap),
              }}
            >
              {slides.map((_, dotIndex) => (
                <View
                  key={dotIndex}
                  className={
                    dotIndex === activeIndex 
                      ? 'bg-theme-pagination-active' 
                      : 'bg-theme-pagination-inactive'
                  }
                  style={{
                    width: s(spacing.onboardingPaginationDotSize),
                    height: s(spacing.onboardingPaginationDotSize),
                    borderRadius: 0, // No border radius - square dots
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

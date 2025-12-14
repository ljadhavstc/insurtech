/**
 * Scaling utilities for responsive design
 * Based on react-native-size-matters pattern
 * 
 * These functions scale values based on device dimensions to maintain
 * consistent visual appearance across different screen sizes.
 * 
 * @example
 * ```tsx
 * import { s, vs, ms, fs } from '@/utils/scale';
 * 
 * // Scale a size (width/height)
 * const width = s(100); // 100px on base design, scaled for device
 * 
 * // Scale a vertical size (height, marginTop, paddingTop, etc.)
 * const height = vs(50); // 50px on base design, scaled vertically
 * 
 * // Scale a moderate size (padding, margin, border radius)
 * const padding = ms(16); // 16px on base design, scaled moderately
 * 
 * // Scale font size
 * const fontSize = fs(16); // 16px font, scaled for readability
 * ```
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (Standard phone - 390x844, excluding notch)
// Design system based on 390px width (380-400px range)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale a size based on screen width
 * Use for: width, horizontal sizes
 * 
 * @param size - Size in pixels from design (Figma)
 * @returns Scaled size for current device
 */
export const s = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size * scale);
};

/**
 * Scale a size based on screen height
 * Use for: height, vertical sizes (margins, paddings)
 * 
 * @param size - Size in pixels from design (Figma)
 * @returns Scaled size for current device
 */
export const vs = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(size * scale);
};

/**
 * Scale a size moderately (average of width and height scaling)
 * Use for: padding, margin, border radius
 * 
 * @param size - Size in pixels from design (Figma)
 * @returns Scaled size for current device
 */
export const ms = (size: number): number => {
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = (widthScale + heightScale) / 2;
  return Math.round(size * scale);
};

/**
 * Scale font size based on screen width with pixel ratio consideration
 * Use for: fontSize
 * 
 * @param size - Font size in pixels from design (Figma)
 * @returns Scaled font size for current device
 */
export const fs = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const scaledSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return SCREEN_WIDTH >= 768 || (SCREEN_WIDTH >= 600 && aspectRatio < 1.6);
};

/**
 * Check if device is small screen
 */
export const isSmallScreen = (): boolean => {
  return SCREEN_WIDTH < 375;
};


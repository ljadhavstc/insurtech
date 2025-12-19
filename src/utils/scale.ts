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

// Get current dimensions (updates on orientation change)
const getCurrentDimensions = () => Dimensions.get('window');

// Helper to get current width/height
const getWidth = () => getCurrentDimensions().width;
const getHeight = () => getCurrentDimensions().height;

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
  const scale = getWidth() / BASE_WIDTH;
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
  const scale = getHeight() / BASE_HEIGHT;
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
  const widthScale = getWidth() / BASE_WIDTH;
  const heightScale = getHeight() / BASE_HEIGHT;
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
  const scale = getWidth() / BASE_WIDTH;
  const scaledSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

/**
 * Get current screen dimensions
 * Always returns current dimensions (updates on orientation change)
 */
export const getScreenDimensions = () => {
  const { width, height } = getCurrentDimensions();
  return { width, height };
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  const { width, height } = getCurrentDimensions();
  const aspectRatio = height / width;
  return width >= 768 || (width >= 600 && aspectRatio < 1.6);
};

/**
 * Check if device is small screen
 */
export const isSmallScreen = (): boolean => {
  return getWidth() < 375;
};

/**
 * Common React Native Breakpoints
 * Based on standard device widths
 */
export const BREAKPOINTS = {
  // Phone breakpoints
  small: 375,      // iPhone SE, older iPhones
  medium: 390,     // iPhone 13/14 standard
  large: 428,      // iPhone 14 Pro Max, Plus models
  
  // Tablet breakpoints
  tablet: 768,     // iPad Mini
  tabletLarge: 1024, // iPad Pro
  
  // Max content width (for boxed layout)
  maxContentWidth: 428, // Stop scaling after this width
} as const;

/**
 * Get constrained width with max-width behavior
 * Scales up to maxWidth, then stays fixed (boxed layout)
 * 
 * @param designWidth - Width from design (e.g., 343px)
 * @param maxWidth - Maximum width before switching to boxed layout (default: 428px)
 * @returns Scaled width, but capped at maxWidth
 * 
 * @example
 * // Button scales up to 428px, then stays at 428px on larger screens
 * const buttonWidth = getConstrainedWidth(343, 428);
 */
export const getConstrainedWidth = (designWidth: number, maxWidth: number = BREAKPOINTS.maxContentWidth): number => {
  const scaledWidth = ms(designWidth);
  // If scaled width exceeds maxWidth, use maxWidth (boxed layout)
  return Math.min(scaledWidth, maxWidth);
};

/**
 * Get responsive width with breakpoint-based scaling
 * Scales proportionally up to breakpoint, then uses fixed max width
 * 
 * @param designWidth - Width from design
 * @param breakpoint - Width at which to stop scaling (default: 428px)
 * @returns Responsive width that scales then becomes fixed
 */
export const getResponsiveWidth = (designWidth: number, breakpoint: number = BREAKPOINTS.maxContentWidth): number => {
  const width = getWidth();
  if (width <= breakpoint) {
    // Scale proportionally for screens up to breakpoint
    return ms(designWidth);
  } else {
    // Fixed width for screens larger than breakpoint (boxed layout)
    const height = getHeight();
    const scaleAtBreakpoint = (breakpoint / BASE_WIDTH + height / BASE_HEIGHT) / 2;
    return Math.round(designWidth * scaleAtBreakpoint);
  }
};

/**
 * Check current breakpoint category
 */
export const getBreakpoint = (): 'small' | 'medium' | 'large' | 'tablet' | 'tabletLarge' => {
  const width = getWidth();
  if (width >= BREAKPOINTS.tabletLarge) return 'tabletLarge';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  if (width >= BREAKPOINTS.large) return 'large';
  if (width >= BREAKPOINTS.medium) return 'medium';
  return 'small';
};

/**
 * Get current orientation
 * @returns 'portrait' | 'landscape'
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = getCurrentDimensions();
  return height > width ? 'portrait' : 'landscape';
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return getOrientation() === 'landscape';
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = (): boolean => {
  return getOrientation() === 'portrait';
};


/**
 * Orientation-aware scaling function
 * Adjusts scaling based on portrait/landscape mode
 * 
 * @param size - Size in pixels from design
 * @param portraitSize - Optional size for portrait (if different)
 * @param landscapeSize - Optional size for landscape (if different)
 * @returns Scaled size based on orientation
 */
export const os = (size: number, portraitSize?: number, landscapeSize?: number): number => {
  const orientation = getOrientation();
  const baseSize = orientation === 'portrait' 
    ? (portraitSize ?? size)
    : (landscapeSize ?? size);
  
  if (orientation === 'landscape') {
    // In landscape, use height as primary scale (since width becomes very large)
    const scale = getHeight() / BASE_HEIGHT;
    return Math.round(baseSize * scale);
  } else {
    // In portrait, use normal moderate scaling
    return ms(baseSize);
  }
};

/**
 * Get responsive width with orientation awareness
 * In landscape, uses height-based scaling to prevent elements from becoming too wide
 * 
 * @param designWidth - Width from design
 * @param breakpoint - Width at which to stop scaling
 * @returns Responsive width adjusted for orientation
 */
export const getOrientationAwareWidth = (
  designWidth: number, 
  breakpoint: number = BREAKPOINTS.maxContentWidth
): number => {
  const orientation = getOrientation();
  
  if (orientation === 'landscape') {
    // In landscape, scale based on height to prevent elements from becoming too wide
    const heightScale = getHeight() / BASE_HEIGHT;
    const scaledWidth = Math.round(designWidth * heightScale);
    // Still apply max-width constraint
    return Math.min(scaledWidth, breakpoint);
  } else {
    // In portrait, use normal responsive width
    return getResponsiveWidth(designWidth, breakpoint);
  }
};


/**
 * Design Tokens
 * Generated from Figma variables
 * 
 * These tokens are used throughout the app for consistent styling.
 * Run `npm run generate-tokens` to regenerate from Figma JSON.
 */

// Brand Colors (reusable across the app)
export const brandColors = {
  purple: '#4F008C', // Primary brand purple
  purpleDark: '#4F008D', // Darker variant
  red: '#FF375E', // Brand accent red
  redDark: '#E62E4D', // Darker variant
} as const;

// Base Colors (semantic, theme-agnostic)
export const baseColors = {
  // Primary colors
  primary: '#0b69ff',
  primaryDark: '#0052cc',
  primaryLight: '#4d94ff',
  
  // Secondary colors
  secondary: '#6c757d',
  secondaryDark: '#545b62',
  secondaryLight: '#868e96',
  
  // Semantic colors
  success: '#28a745',
  error: '#dc3545',
  errorLight: '#F3607A', // Lighter error color for borders
  errorDark: '#D81034', // Darker error color for text
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Brand colors
  ...brandColors,
} as const;

// Light Theme Colors
export const lightTheme = {
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  backgroundCard: '#F3F3F7',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  textPrimary: '#090D0F',
  textSecondary: '#687078',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textDisabled: '#D1D5DB',
  
  // Border colors
  border: '#DFE0E6',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Muted colors
  muted: '#F3F3F7',
  mutedDark: '#E5E7EB',
  
  // Interactive colors
  interactive: brandColors.purple,
  interactiveHover: brandColors.purpleDark,
  interactiveActive: brandColors.red,
  
  // Status colors
  paginationActive: '#7F7F7F',
  paginationInactive: '#D9D9D9',
} as const;

// Dark Theme Colors
export const darkTheme = {
  // Background colors
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',
  backgroundCard: '#1F2937',
  backgroundOverlay: 'rgba(0, 0, 0, 0.7)',
  
  // Text colors
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',
  textDisabled: '#6B7280',
  
  // Border colors
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',
  
  // Muted colors
  muted: '#374151',
  mutedDark: '#1F2937',
  
  // Interactive colors
  interactive: '#6B46C1', // Lighter purple for dark mode
  interactiveHover: brandColors.purple,
  interactiveActive: brandColors.red,
  
  // Status colors
  paginationActive: '#9CA3AF',
  paginationInactive: '#4B5563',
} as const;

// Legacy colors export (for backward compatibility)
export const colors = {
  ...baseColors,
  // Map old screen-specific colors to semantic tokens
  splashBackground: brandColors.purple,
  splashLogoRed: brandColors.red,
  onboardingBackground: lightTheme.background,
  onboardingCardBackground: lightTheme.backgroundCard,
  onboardingCardBorder: lightTheme.border,
  onboardingTextPrimary: lightTheme.textPrimary,
  onboardingTextSecondary: lightTheme.textSecondary,
  onboardingBrandPurple: brandColors.purpleDark,
  onboardingBrandRed: brandColors.red,
  onboardingPaginationActive: lightTheme.paginationActive,
  onboardingPaginationInactive: lightTheme.paginationInactive,
  // Legacy semantic colors
  background: lightTheme.background,
  backgroundSecondary: lightTheme.backgroundSecondary,
  backgroundTertiary: lightTheme.backgroundTertiary,
  textPrimary: lightTheme.textPrimary,
  textSecondary: lightTheme.textSecondary,
  textTertiary: lightTheme.textTertiary,
  textInverse: lightTheme.textInverse,
  border: lightTheme.border,
  borderLight: lightTheme.borderLight,
  borderDark: lightTheme.borderDark,
  muted: lightTheme.muted,
  mutedDark: lightTheme.mutedDark,
} as const;

// Spacing scale (in pixels from Figma)
// Base design width: 390px (standard phone)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  // Splash screen specific spacing
  splashStatusBar: 36,
  splashStatusBarPadding: 7,
  splashStatusBarTop: 8,
  splashTextGroupLeft: 132,
  splashTextGroupTop: 375,
  splashTextGroupWidth: 126,
  splashTextGroupGap: 10,
  splashLogoLeft: 188,
  splashLogoTop: 457.5,
  splashLogoHeight: 7,
  splashLogoRedWidth: 14,
  splashLogoWhiteWidth: 7,
  splashFooterBottom: 52,
  splashFooterLeft: 45,
  splashFooterWidth: 299,
  // Onboarding screen specific spacing
  onboardingStatusBarHeight: 46.15, // Status bar height from Figma design
  onboardingHeaderPadding: 15.38,
  onboardingHeaderGap: 80.77,
  onboardingContentPadding: 23,
  onboardingContentGap: 36,
  onboardingCardPadding: 36,
  onboardingCardGap: 24,
  onboardingCardWidth: 344,
  onboardingCardHeight: 350,
  onboardingImageWidth: 150,
  onboardingImageHeight: 90,
  onboardingButtonGap: 8,
  onboardingButtonPadding: 12,
  onboardingPaginationGap: 5,
  onboardingPaginationDotSize: 5,
} as const;

// Font Family
// Try both variations - React Native uses the font family name from the TTF file metadata
export const fontFamily = {
  primary: 'STC Forward', // STC Forward font (try with space first)
  primaryAlt: 'STCForward', // Alternative name (without space)
  system: 'System', // System default font
} as const;

// Font Weight Tokens (reusable across the app)
export const fontWeight = {
  thin: '100' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
} as const;

// Typography scale (font sizes in pixels from Figma)
// Base design width: 390px (standard phone)
// Reusable typography tokens - semantic naming instead of screen-specific
export const typography = {
  // Display styles (large, prominent text)
  displayLarge: {
    fontSize: 40,
    lineHeight: 40, // 100% = 40px
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  displayMedium: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    fontFamily: fontFamily.primary,
  },
  
  // Heading styles
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    fontFamily: fontFamily.primary,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    fontFamily: fontFamily.primary,
  },
  h3: {
    fontSize: 22,
    lineHeight: 26.71, // 22 * 1.214
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  h4: {
    fontSize: 20,
    lineHeight: 24, // 20 * 1.2
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  
  // Body text styles
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 17, // 14 * 1.214
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  bodySmallTight: {
    fontSize: 14,
    lineHeight: 15, // 14px font with 15px line height
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  bodyTight: {
    fontSize: 16,
    lineHeight: 16, // 100% = 16px
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  
  // UI component styles
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    fontFamily: fontFamily.primary,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    fontFamily: fontFamily.primary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  overline: {
    fontSize: 13,
    lineHeight: 19.5, // 150% = 13 * 1.5
    fontWeight: '300' as const, // Light
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  nav: {
    fontSize: 15.38,
    lineHeight: 19.23, // 15.38 * 1.25
    fontWeight: '400' as const,
    textTransform: 'lowercase' as const,
    fontFamily: fontFamily.primary,
  },
  
  // System/Status bar styles
  statusBar: {
    fontSize: 15,
    lineHeight: 17.25, // 15 * 1.15
    fontWeight: '700' as const,
    letterSpacing: 0.2328, // 15 * 0.01552
    fontFamily: fontFamily.system, // Status bar uses system font
  },
  
  // Legacy screen-specific typography (mapped to reusable tokens)
  splashName: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  splashFromStc: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  splashFooter: {
    fontSize: 13,
    lineHeight: 19.5,
    fontWeight: '300' as const,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  splashTime: {
    fontSize: 15,
    lineHeight: 17.25,
    fontWeight: '700' as const,
    letterSpacing: 0.2328,
    fontFamily: fontFamily.system,
  },
  onboardingHeader: {
    fontSize: 15.38,
    lineHeight: 19.23,
    fontWeight: '400' as const,
    textTransform: 'lowercase' as const,
    fontFamily: fontFamily.primary,
  },
  onboardingTitle: {
    fontSize: 40,
    lineHeight: 48.56,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  onboardingSubtitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  onboardingDescription: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  onboardingSlideTitle: {
    fontSize: 22,
    lineHeight: 26.71,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
  onboardingSlideDescription: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400' as const,
    fontFamily: fontFamily.primary,
  },
} as const;

// Composite Typography Tokens (convenient combinations of size + weight)
// These combine font size, line height, and weight for common use cases
export const textStyles = {
  // Title styles (large, bold text)
  title: {
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'title-large': {
    fontSize: typography.displayLarge.fontSize,
    lineHeight: typography.displayLarge.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
    letterSpacing: 0,
  },
  'title-medium': {
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'title-small': {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  
  // Subtitle styles (medium, regular/semibold text)
  subtitle: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  'subtitle-bold': {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.primary,
  },
  'subtitle-small': {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  
  // Text styles (body text with various weights)
  text: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  'text-bold': {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'text-semibold': {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.primary,
  },
  'text-medium': {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.primary,
  },
  
  // Small text styles
  'text-small': {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  'text-small-tight': {
    fontSize: typography.bodySmallTight.fontSize,
    lineHeight: typography.bodySmallTight.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  'text-small-bold': {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'text-small-semibold': {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.primary,
  },
  'text-small-medium': {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.primary,
  },
  
  // Caption styles
  caption: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.primary,
  },
  'caption-bold': {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'caption-medium': {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.primary,
  },
  
  // Label styles
  label: {
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.primary,
  },
  'label-bold': {
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.primary,
  },
  'label-semibold': {
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.primary,
  },
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Animation durations (in milliseconds)
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Theme helper function
export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode = 'light') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Export type helpers
export type Color = typeof colors[keyof typeof colors];
export type Spacing = typeof spacing[keyof typeof spacing];
export type TypographyVariant = keyof typeof typography;
export type TextStyleVariant = keyof typeof textStyles;
export type FontWeight = typeof fontWeight[keyof typeof fontWeight];
export type BorderRadius = typeof borderRadius[keyof typeof borderRadius];
export type Theme = typeof lightTheme;


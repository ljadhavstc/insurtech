/**
 * Text Component
 * 
 * A NativeWind-styled React Native Text wrapper that accepts:
 * - `size` prop (Figma px) - automatically scaled using fs()
 * - `className` for Tailwind classes (color, spacing, etc.)
 * - All standard Text props
 * 
 * @example
 * ```tsx
 * <Text size={16} className="text-primary font-semibold">
 *   Hello World
 * </Text>
 * ```
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, Platform } from 'react-native';
import { fs } from '@/utils/scale';
import { typography, textStyles } from '@/styles/tokens';

export interface TextProps extends RNTextProps {
  /**
   * Font size in pixels from Figma design
   * Will be automatically scaled for device
   */
  size?: number;
  
  /**
   * Typography variant from design tokens
   * Can be either a typography variant or a text style variant
   * Overrides size if provided
   */
  variant?: keyof typeof typography | keyof typeof textStyles;
  
  /**
   * Tailwind className for styling
   */
  className?: string;
  
  /**
   * Allow font scaling (accessibility)
   * Default: true
   */
  allowFontScaling?: boolean;
}

export const Text: React.FC<TextProps> = ({
  size,
  variant,
  className,
  allowFontScaling = true,
  style,
  children,
  ...props
}) => {
  const getTypographyConfig = (): any => {
    if (!variant) return null;
    
    // Check if it's a text style variant first
    if (variant in textStyles) {
      return textStyles[variant as keyof typeof textStyles];
    }
    
    // Otherwise, it's a typography variant
    if (variant in typography) {
      return typography[variant as keyof typeof typography];
    }
    
    return null;
  };

  const getFontSize = (): number | undefined => {
    if (variant) {
      const config = getTypographyConfig();
      if (config) {
        return fs(config.fontSize);
      }
    }
    if (size) {
      return fs(size);
    }
    return undefined;
  };

  const getFontFamily = (): string | undefined => {
    if (variant) {
      const config = getTypographyConfig();
      if (config && config.fontFamily) {
        return config.fontFamily;
      }
    }
    return undefined;
  };

  const getTypographyStyle = () => {
    if (!variant) return {};
    
    const config = getTypographyConfig();
    if (!config) return {};
    
    const typographyStyle: any = {
      fontSize: fs(config.fontSize),
    };
    
    if (config.lineHeight) {
      typographyStyle.lineHeight = fs(config.lineHeight);
    }
    
    if (config.fontWeight) {
      typographyStyle.fontWeight = config.fontWeight;
    }
    
    if (config.fontFamily) {
      // Try both font name variations
      const fontName = config.fontFamily === 'STC Forward' 
        ? (Platform.OS === 'ios' ? 'STC Forward' : 'STCForward')
        : config.fontFamily;
      typographyStyle.fontFamily = fontName;
    }
    
    if ('letterSpacing' in config && config.letterSpacing !== undefined) {
      typographyStyle.letterSpacing = config.letterSpacing;
    }
    
    return typographyStyle;
  };

  const fontSize = getFontSize();
  const fontFamilyValue = getFontFamily();
  const typographyStyle = variant ? getTypographyStyle() : {};

  // Check if style prop has fontWeight override
  const hasFontWeightOverride = style && 'fontWeight' in style;

  // Build style array - order matters for overrides
  const styleArray = [];
  if (variant && Object.keys(typographyStyle).length > 0) {
    // If style prop has fontWeight, remove it from typography style to allow override
    if (hasFontWeightOverride && typographyStyle.fontWeight) {
      const { fontWeight, ...restTypographyStyle } = typographyStyle;
      styleArray.push(restTypographyStyle);
    } else {
      styleArray.push(typographyStyle);
    }
  }
  if (!variant) {
    if (fontSize) styleArray.push({ fontSize });
    if (fontFamilyValue) {
      const fontName = fontFamilyValue === 'STC Forward' 
        ? (Platform.OS === 'ios' ? 'STC Forward' : 'STCForward')
        : fontFamilyValue;
      styleArray.push({ fontFamily: fontName });
    }
  }
  // Style prop comes last to allow overrides (highest priority)
  if (style) styleArray.push(style);

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      className={className}
      style={styleArray.length > 0 ? styleArray : undefined}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;


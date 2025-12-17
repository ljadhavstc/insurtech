/**
 * Icon Component
 * 
 * Optimized SVG icon wrapper with customizable size, color, and styling.
 * Icons are stored as React components for tree-shaking and minimal bundle size.
 * 
 * @example
 * ```tsx
 * <Icon name="chevron-left" size={24} color="#090D0F" />
 * <Icon name="eye" size={16} color="#687078" />
 * ```
 */

import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { View } from 'react-native';
import Svg, { SvgProps } from 'react-native-svg';
import { ms } from '@/utils/scale';

export interface IconProps {
  /**
   * Icon name (must match exported icon component)
   */
  name: string;
  
  /**
   * Icon size in Figma pixels (will be scaled responsively)
   * Default: 24
   */
  size?: number;
  
  /**
   * Icon color
   * Default: currentColor (inherits text color)
   */
  color?: string;
  
  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Custom width override
   */
  width?: number;
  
  /**
   * Custom height override
   */
  height?: number;
}

// Icon registry - lazy loaded for tree-shaking
// Using any to allow different icon prop types
const iconRegistry: Record<string, React.ComponentType<any>> = {};

/**
 * Register an icon component
 * This allows dynamic icon loading while maintaining tree-shaking
 */
export const registerIcon = (name: string, component: React.ComponentType<any>) => {
  iconRegistry[name] = component;
};

/**
 * Get registered icon component
 */
const getIconComponent = (name: string): React.ComponentType<any> | null => {
  return iconRegistry[name] || null;
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  style,
  testID,
  width,
  height,
}) => {
  const IconComponent = getIconComponent(name);
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconRegistry).join(', ')}`);
    return null;
  }
  
  const scaledSize = ms(size);
  const iconWidth = width ? ms(width) : scaledSize;
  const iconHeight = height ? ms(height) : scaledSize;
  
  return (
    <View style={[{ width: iconWidth, height: iconHeight }, style]} testID={testID}>
      <IconComponent
        width={iconWidth}
        height={iconHeight}
        color={color}
      />
    </View>
  );
};

export default Icon;


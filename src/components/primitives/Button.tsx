/**
 * Button Component
 * 
 * Composes Box + Pressable + Text with variant support.
 * Accepts height and radius in Figma px and scales them with ms().
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onPress={handlePress}>
 *   Click Me
 * </Button>
 * ```
 */

import React from 'react';
import { Pressable, PressableProps, ActivityIndicator, StyleSheet } from 'react-native';
import { ms } from '@/utils/scale';
import { Box } from './Box';
import { Text } from './Text';
import { borderRadius } from '@/styles/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button variant
   */
  variant?: ButtonVariant;
  
  /**
   * Button text/content
   */
  children: React.ReactNode;
  
  /**
   * Button height in Figma px - will be scaled
   * Default: 48
   */
  height?: number;
  
  /**
   * Border radius in Figma px - will be scaled
   * Default: 8
   */
  radius?: number;
  
  /**
   * Show loading state
   */
  loading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Additional Tailwind classes
   */
  className?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary-dark',
  secondary: 'bg-secondary active:bg-secondary-dark',
  ghost: 'bg-transparent active:bg-gray-100',
  outline: 'bg-transparent border border-gray-300 active:bg-gray-50',
  danger: 'bg-error active:bg-red-600',
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  ghost: 'text-primary',
  outline: 'text-text-primary',
  danger: 'text-white',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  height = 48,
  radius = 8,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  testID,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const scaledHeight = ms(height);
  const scaledRadius = ms(radius);

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      testID={testID}
      className={`
        ${variantStyles[variant]}
        ${isDisabled ? 'opacity-50' : ''}
        ${fullWidth ? 'w-full' : ''}
        items-center justify-center
        ${className || ''}
      `}
      style={[
        {
          height: scaledHeight,
          borderRadius: scaledRadius,
        },
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' || variant === 'outline' ? '#0b69ff' : '#ffffff'}
          size="small"
        />
      ) : (
        <Text
          className={variantTextStyles[variant]}
          size={16}
          style={{ fontWeight: '600' }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;


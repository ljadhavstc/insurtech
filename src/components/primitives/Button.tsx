/**
 * Button Component
 * 
 * Composes Box + Pressable + Text with variant support.
 * Matches Figma design system with Solid and Ghost variants.
 * Accepts height and radius in Figma px and scales them with ms().
 * 
 * @example
 * ```tsx
 * <Button variant="solid" onPress={handlePress}>
 *   Click Me
 * </Button>
 * ```
 */

import React from 'react';
import { Pressable, PressableProps, ActivityIndicator } from 'react-native';
import { ms } from '@/utils/scale';
import { Text } from './Text';
import { lightTheme, typography, brandColors } from '@/styles/tokens';

export type ButtonVariant = 'solid' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button variant (solid or ghost)
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * Button text/content
   */
  children: React.ReactNode;
  
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

const sizeMap: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  small: { height: 40, paddingHorizontal: 12, fontSize: 14 },
  medium: { height: 48, paddingHorizontal: 16, fontSize: 16 },
  large: { height: 56, paddingHorizontal: 20, fontSize: 18 },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'medium',
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  testID,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const sizeConfig = sizeMap[size];
  const scaledHeight = ms(sizeConfig.height);
  const scaledPaddingHorizontal = ms(sizeConfig.paddingHorizontal);
  const scaledRadius = ms(2); // Border radius from Figma: 2px
  const scaledFontSize = ms(sizeConfig.fontSize);

  // Solid variant: Disabled uses #FFC1CD, enabled uses primary color (brand red)
  // Ghost variant: Transparent background with text color
  const backgroundColor = variant === 'solid' 
    ? (isDisabled ? '#FFC1CD' : brandColors.red) // Primary color: #FF375E
    : 'transparent';
  
  const textColor = variant === 'solid'
    ? (isDisabled ? '#FFFFFF' : '#FFFFFF')
    : brandColors.red; // #FF375E for ghost variant (primary color)

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      testID={testID}
      className={`
        ${fullWidth ? 'w-full' : ''}
        items-center justify-center
        ${className || ''}
      `}
      style={[
        {
          height: scaledHeight,
          borderRadius: scaledRadius,
          paddingHorizontal: scaledPaddingHorizontal,
          backgroundColor,
          opacity: variant === 'ghost' && isDisabled ? 0.5 : 1,
        },
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={textColor}
          size="small"
        />
      ) : (
        <Text
          style={{
            fontSize: scaledFontSize,
            lineHeight: scaledFontSize * 1.25, // 1.25em line height
            fontWeight: '400',
            fontFamily: typography.button.fontFamily,
            color: textColor,
            textTransform: 'lowercase',
            textAlign: 'center',
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;


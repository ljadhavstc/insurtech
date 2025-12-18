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
import { brandColors } from '@/styles/tokens';

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

const sizeMap: Record<ButtonSize, { height: number; paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  small: { height: 40, paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 },
  medium: { height: 56, paddingVertical: 16, paddingHorizontal: 22, fontSize: 16 },
  large: { height: 56, paddingVertical: 16, paddingHorizontal: 22, fontSize: 18 },
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
  const scaledPaddingVertical = ms(sizeConfig.paddingVertical);
  const scaledPaddingHorizontal = ms(sizeConfig.paddingHorizontal);
  const scaledBorderRadius = ms(2);
  const scaledGap = ms(10);
  // Button width: 343px based on 390px design width (87.95% of screen width)
  const scaledWidth = fullWidth ? ms(343) : undefined;

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
        items-center justify-center
        ${variant === 'ghost' && isDisabled ? 'opacity-50' : ''}
        ${className || ''}
      `}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        paddingVertical: scaledPaddingVertical,
        paddingHorizontal: scaledPaddingHorizontal,
        borderRadius: scaledBorderRadius,
        gap: scaledGap,
        backgroundColor,
        alignSelf: fullWidth ? 'center' : undefined,
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={textColor}
          size="small"
        />
      ) : (
        <Text
          variant="button"
          className="lowercase text-center"
          style={{
            color: textColor,
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;


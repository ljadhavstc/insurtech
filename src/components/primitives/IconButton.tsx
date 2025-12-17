/**
 * IconButton Component
 * 
 * A button that displays an icon. Supports different sizes and variants.
 * 
 * @example
 * ```tsx
 * <IconButton
 *   icon={<Icon name="heart" />}
 *   onPress={handlePress}
 *   variant="ghost"
 * />
 * ```
 */

import React from 'react';
import { Pressable, PressableProps } from 'react-native';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Icon component to display
   */
  icon: React.ReactNode;
  
  /**
   * Button variant
   */
  variant?: IconButtonVariant;
  
  /**
   * Button size
   */
  size?: IconButtonSize;
  
  /**
   * Additional Tailwind classes
   */
  className?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

const sizeMap: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary-dark',
  secondary: 'bg-secondary active:bg-secondary-dark',
  ghost: 'bg-transparent active:bg-gray-100',
  outline: 'bg-transparent border border-gray-300 active:bg-gray-50',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  testID,
  ...props
}) => {
  return (
    <Pressable
      testID={testID}
      className={`
        ${variantStyles[variant]}
        ${sizeMap[size]}
        items-center justify-center
        rounded-full
        ${className || ''}
      `}
      {...props}
    >
      {icon}
    </Pressable>
  );
};

export default IconButton;


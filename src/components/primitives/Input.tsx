/**
 * Input Component
 * 
 * TextInput wrapper with error state support and Tailwind class integration.
 * Integrates with FormField wrapper for react-hook-form.
 * 
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter email"
 *   value={value}
 *   onChangeText={onChangeText}
 *   error={error}
 * />
 * ```
 */

import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from 'react-native';
import { ms } from '@/utils/scale';
import { Text } from './Text';
import { borderRadius } from '@/styles/tokens';

export interface InputProps extends TextInputProps {
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Left icon component
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon component
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Input height in Figma px - will be scaled
   * Default: 48
   */
  height?: number;
  
  /**
   * Border radius in Figma px - will be scaled
   * Default: 8
   */
  radius?: number;
  
  /**
   * Additional Tailwind classes
   */
  className?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  helperText,
  leftIcon,
  rightIcon,
  height = 48,
  radius = 8,
  className,
  testID,
  style,
  ...props
}) => {
  const scaledHeight = ms(height);
  const scaledRadius = ms(radius);
  const hasError = !!error;

  return (
    <View className="w-full">
      {label && (
        <Text
          size={14}
          className="text-text-primary mb-2"
          style={{ fontWeight: '500' }}
        >
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center
          border ${hasError ? 'border-error' : 'border-border'}
          bg-white
          ${className || ''}
        `}
        style={[
          {
            height: scaledHeight,
            borderRadius: scaledRadius,
            paddingHorizontal: ms(12),
          },
        ]}
      >
        {leftIcon && (
          <View className="mr-2">
            {leftIcon}
          </View>
        )}
        <TextInput
          testID={testID}
          className="flex-1 text-text-primary text-body"
          placeholderTextColor="#9ca3af"
          style={[
            {
              fontSize: ms(16),
            },
            style,
          ]}
          {...props}
        />
        {rightIcon && (
          <View className="ml-2">
            {rightIcon}
          </View>
        )}
      </View>
      {(error || helperText) && (
        <Text
          size={12}
          className={hasError ? 'text-error mt-1' : 'text-text-tertiary mt-1'}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;


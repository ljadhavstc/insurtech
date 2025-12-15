/**
 * Input Component
 * 
 * Flexible TextInput wrapper with fixed label (caption) at top,
 * distinct placeholder and entered text colors, and full customization support.
 * Integrates with FormField wrapper for react-hook-form.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="phone number"
 *   placeholder="eg. 33011234"
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
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ms } from '@/utils/scale';
import { Text } from './Text';
import { lightTheme, typography } from '@/styles/tokens';

export interface InputProps extends TextInputProps {
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Label text (caption) shown above input - fixed position and styling
   */
  label?: string;
  
  /**
   * Helper text shown below input
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
   * Additional Tailwind classes for container
   */
  className?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Custom styles for different parts of the input
   */
  styles?: {
    /** Container wrapper styles */
    container?: ViewStyle;
    /** Label (caption) styles */
    label?: TextStyle;
    /** Input container (border box) styles */
    inputContainer?: ViewStyle;
    /** TextInput styles */
    input?: TextStyle;
    /** Error/helper text styles */
    errorText?: TextStyle;
  };
  
  /**
   * Color customization
   */
  colors?: {
    /** Label (caption) color - default: textSecondary (#687078) */
    labelColor?: string;
    /** Placeholder text color - default: textSecondary (#687078) */
    placeholderColor?: string;
    /** Entered text color - default: textPrimary (#090D0F) */
    textColor?: string;
    /** Border color - default: border (#DFE0E6) */
    borderColor?: string;
    /** Border color when error - default: error */
    errorBorderColor?: string;
    /** Error text color - default: error */
    errorTextColor?: string;
  };
  
  /**
   * Typography customization
   */
  typography?: {
    /** Label font size - default: 12 */
    labelSize?: number;
    /** Input font size - default: 16 */
    inputSize?: number;
    /** Error text font size - default: 12 */
    errorSize?: number;
  };
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  helperText,
  leftIcon,
  rightIcon,
  className,
  testID,
  style,
  placeholder,
  styles,
  colors,
  typography: typographyOverrides,
  value,
  ...props
}) => {
  const hasError = !!error;
  const scaledRadius = ms(2); // Border radius from Figma: 2px
  
  // Default colors from Figma design
  const labelColor = colors?.labelColor ?? '#687078'; // fill_EZZERF from Figma
  const placeholderColor = colors?.placeholderColor ?? '#687078'; // fill_EZZERF from Figma
  const textColor = colors?.textColor ?? '#090D0F'; // fill_H6RGWM from Figma (for entered text)
  const borderColor = hasError 
    ? (colors?.errorBorderColor ?? lightTheme.error)
    : (colors?.borderColor ?? '#DFE0E6'); // stroke_GQS94T from Figma
  const errorTextColor = colors?.errorTextColor ?? lightTheme.error;
  
  // Default typography sizes from Figma design
  // Label: english/label/label-xsmall-regular - 12px, 1.25em line height
  const labelSize = typographyOverrides?.labelSize ?? 12;
  const labelLineHeight = labelSize * 1.25; // 1.25em from Figma
  
  // Input: english/body/body-medium-regular - 16px, 1.25em line height
  const inputSize = typographyOverrides?.inputSize ?? 16;
  const inputLineHeight = inputSize * 1.25; // 1.25em from Figma
  
  const errorSize = typographyOverrides?.errorSize ?? 12;
  
  // Check if input has value (to determine if placeholder should show)
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <View 
      className={`w-full ${className || ''}`}
      style={styles?.container}
    >
      {/* Input Container - Matching Figma layout_QGHPSN */}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor, // #DFE0E6 from Figma stroke_GQS94T
            backgroundColor: '#FFFFFF', // fill_KBO61H from Figma
            borderRadius: scaledRadius, // 2px from Figma
            paddingHorizontal: ms(16), // 16px horizontal padding (responsive)
            paddingVertical: ms(10.5), // 10.5px vertical padding (responsive)
            gap: ms(4), // 4px gap from Figma layout_QGHPSN
            minHeight: ms(48),
          },
          styles?.inputContainer,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={{ marginRight: ms(4) }}>
            {leftIcon}
          </View>
        )}
        
        {/* Text Container - Matching Figma layout_0BDB1J */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 0, // No additional horizontal padding (already handled by container)
            gap: ms(4), // 4px gap from Figma
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Label (Caption) - Inside input, fixed position and styling from Figma */}
          {label && (
            <Text
              variant="caption"
              style={[
                {
                  fontSize: ms(labelSize), // 12px from Figma english/label/label-xsmall-regular
                  lineHeight: ms(labelLineHeight), // 1.25em = 15px
                  fontWeight: '400',
                  fontFamily: typography.caption.fontFamily, // STC Forward
                  color: labelColor, // #687078 from Figma fill_EZZERF
                  textAlign: 'left',
                  marginBottom: ms(0), // No margin when inside
                },
                styles?.label,
              ]}
            >
              {label}
            </Text>
          )}
          
          {/* TextInput - Matching Figma english/body/body-medium-regular */}
          <TextInput
            testID={testID}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor} // #687078 from Figma fill_EZZERF
            value={value}
            style={[
              {
                fontSize: ms(inputSize), // 16px from Figma english/body/body-medium-regular
                lineHeight: ms(inputLineHeight), // 1.25em = 20px
                fontWeight: '400',
                fontFamily: typography.body.fontFamily, // STC Forward
                color: textColor, // #090D0F for entered text, #687078 for placeholder
                padding: 0,
                margin: 0,
                minHeight: ms(20),
                textAlign: 'left',
              },
              styles?.input,
              style, // Allow style prop override
            ]}
            {...props}
          />
        </View>
        
        {/* Right Icon */}
        {rightIcon && (
          <View style={{ marginLeft: ms(4) }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {/* Error/Helper Text */}
      {(error || helperText) && (
        <View style={{ marginTop: ms(4) }}>
          <Text
            variant="caption"
            style={[
              {
                fontSize: ms(errorSize),
                lineHeight: ms(errorSize * 1.25),
                fontWeight: '400',
                fontFamily: typography.caption.fontFamily,
                color: hasError ? errorTextColor : lightTheme.textTertiary,
              },
              styles?.errorText,
            ]}
          >
            {error || helperText}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;


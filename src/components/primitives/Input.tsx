/**
 * Input Component
 * 
 * Flexible TextInput wrapper with variants, auto-validation, and validation messages.
 * Supports multiple input types with automatic validation rules.
 * Integrates with FormField wrapper for react-hook-form.
 * 
 * @example
 * ```tsx
 * <Input
 *   variant="mobile"
 *   label="phone number"
 *   placeholder="eg. 33011234"
 *   value={value}
 *   onChangeText={onChangeText}
 * />
 * ```
 */

import React, { useState, useMemo } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { ms } from '@/utils/scale';
import { Text } from './Text';
import { lightTheme, typography } from '@/styles/tokens';
import { EyeIcon, EyeOffIcon } from '../icons';

// Input type variants
export type InputVariant = 
  | 'mobile'                    // Mobile number (local format)
  | 'mobile-with-country-code'  // Mobile with country code (+966...)
  | 'email'                     // Email address
  | 'password'                  // Password with visibility toggle
  | 'text';                     // Normal text input

// Icon position variants
export type IconPosition = 
  | 'none'      // No icon
  | 'start'     // Icon at start (left)
  | 'end';      // Icon at end (right)

// Validation rule function type
type ValidationRule = (value: string) => string | undefined;

// Validation rules for each variant
const validationRules: Record<InputVariant, ValidationRule> = {
  mobile: (value: string) => {
    if (!value) return undefined;
    // Mobile number: 8-15 digits, can start with 0 or country code
    const mobileRegex = /^[0-9]{8,15}$/;
    if (!mobileRegex.test(value.replace(/\s+/g, ''))) {
      return 'number is invalid';
    }
    return undefined;
  },
  
  'mobile-with-country-code': (value: string) => {
    if (!value) return undefined;
    // Mobile with country code: +966XXXXXXXXX or 00966XXXXXXXXX
    const countryCodeRegex = /^(\+966|00966|966)?[0-9]{9}$/;
    const cleanValue = value.replace(/\s+/g, '');
    if (!countryCodeRegex.test(cleanValue)) {
      return 'number is invalid';
    }
    return undefined;
  },
  
  email: (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value)) {
      return 'email is invalid';
    }
    return undefined;
  },
  
  password: (value: string) => {
    if (!value) return undefined;
    if (value.length < 8) {
      return 'password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'password must contain at least one uppercase letter';
    }
    if (!/(?=.*[0-9])/.test(value)) {
      return 'password must contain at least one number';
    }
    return undefined;
  },
  
  text: () => undefined, // No validation for plain text
};

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /**
   * Input variant - determines validation rules and keyboard type
   */
  variant?: InputVariant;
  
  /**
   * Icon position variant
   */
  iconPosition?: IconPosition;
  
  /**
   * Error message to display (overrides auto-validation)
   */
  error?: string;
  
  /**
   * Label text (caption) shown inside input - fixed position and styling
   */
  label?: string;
  
  /**
   * Helper text shown below input
   */
  helperText?: string;
  
  /**
   * Icon component (used based on iconPosition)
   */
  icon?: React.ReactNode;
  
  /**
   * Left icon component (overrides iconPosition)
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon component (overrides iconPosition)
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Show password visibility toggle (for password variant)
   */
  showPasswordToggle?: boolean;
  
  /**
   * Enable auto-validation based on variant
   */
  autoValidate?: boolean;
  
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
    /** Border color when error - default: #F3607A */
    errorBorderColor?: string;
    /** Error text color - default: #D81034 */
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
    /** Error text font size - default: 14 */
    errorSize?: number;
  };
}

export const Input: React.FC<InputProps> = ({
  variant = 'text',
  iconPosition = 'none',
  error: externalError,
  label,
  helperText,
  icon,
  leftIcon,
  rightIcon,
  showPasswordToggle = true,
  autoValidate = true,
  className,
  testID,
  style,
  placeholder,
  styles,
  colors,
  typography: typographyOverrides,
  value,
  onChangeText,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();
  
  // Determine keyboard type and secure text entry based on variant
  const keyboardType = useMemo(() => {
    switch (variant) {
      case 'mobile':
      case 'mobile-with-country-code':
        return 'phone-pad';
      case 'email':
        return 'email-address';
      case 'password':
        return 'default';
      default:
        return 'default';
    }
  }, [variant]);
  
  const secureTextEntry = variant === 'password' && !isPasswordVisible;
  
  // Auto-validation
  const validationError = useMemo(() => {
    if (!autoValidate || !value) return undefined;
    const rule = validationRules[variant];
    return rule(value);
  }, [value, variant, autoValidate]);
  
  const error = externalError || internalError || validationError;
  const hasError = !!error;
  
  // Default colors from Figma design
  const labelColor = colors?.labelColor ?? '#687078'; // fill_48KQHY from Figma
  const placeholderColor = colors?.placeholderColor ?? '#687078';
  const textColor = colors?.textColor ?? '#090D0F'; // fill_7ZB7A5 from Figma
  const borderColor = hasError 
    ? (colors?.errorBorderColor ?? '#F3607A') // stroke_01NKHH from Figma error state
    : (colors?.borderColor ?? '#DFE0E6');
  const errorTextColor = colors?.errorTextColor ?? '#D81034'; // fill_OHE7T0 from Figma
  
  // Default typography sizes from Figma design
  const labelSize = typographyOverrides?.labelSize ?? 12;
  const labelLineHeight = labelSize * 1.25; // 1.25em from Figma
  
  const inputSize = typographyOverrides?.inputSize ?? 16;
  const inputLineHeight = inputSize * 1.25; // 1.25em from Figma
  
  const errorSize = typographyOverrides?.errorSize ?? 14; // From Figma style_PN61H8
  const errorLineHeight = errorSize * 1.2142857142857142; // 1.2142857142857142em from Figma
  
  // Handle icon positioning
  const displayLeftIcon = leftIcon || (iconPosition === 'start' && icon);
  const displayRightIcon = rightIcon || (iconPosition === 'end' && icon);
  
  // Password visibility toggle icon
  const passwordToggleIcon = variant === 'password' && showPasswordToggle ? (
    <TouchableOpacity
      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      className="p-xs"
    >
      {isPasswordVisible ? (
        <EyeOffIcon width={ms(20)} height={ms(20)} color={labelColor} />
      ) : (
        <EyeIcon width={ms(20)} height={ms(20)} color={labelColor} />
      )}
    </TouchableOpacity>
  ) : null;
  
  const finalRightIcon = displayRightIcon || passwordToggleIcon;
  
  // Handle text change with validation
  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
    
    // Update internal error on change
    if (autoValidate && text) {
      const rule = validationRules[variant];
      const validationResult = rule(text);
      setInternalError(validationResult);
    } else {
      setInternalError(undefined);
    }
  };
  
  return (
    <View 
      className={`w-full ${className || ''}`}
      style={styles?.container}
    >
      {/* Input Container - Matching Figma layout_QGHPSN */}
      <View
        className={`
          flex-row items-center
          border rounded-sm
          bg-white
          px-md py-[10.5px]
          gap-xs
          min-h-[48px]
          ${hasError ? 'border-error-light' : 'border-theme-border'}
        `}
        style={[
          {
            borderColor,
            ...styles?.inputContainer,
          },
        ]}
      >
        {/* Left Icon */}
        {displayLeftIcon && (
          <View className="mr-xs">
            {displayLeftIcon}
          </View>
        )}
        
        {/* Text Container */}
        <View className="flex-1 px-0 gap-xs flex-col justify-center">
          {/* Label (Caption) - Inside input */}
          {label && (
            <Text
              variant="caption"
              className="text-left lowercase"
              style={[
                {
                  fontSize: ms(labelSize),
                  lineHeight: ms(labelLineHeight),
                  color: labelColor,
                },
                styles?.label,
              ]}
            >
              {label.toLowerCase()}
            </Text>
          )}
          
          {/* TextInput */}
          <TextInput
            testID={testID}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={variant === 'email' ? 'none' : 'sentences'}
            autoCorrect={variant !== 'email' && variant !== 'password'}
            onChangeText={handleChangeText}
            className="p-0 m-0 text-left min-h-[20px] font-normal"
            style={[
              {
                fontSize: ms(inputSize),
                lineHeight: ms(inputLineHeight),
                fontFamily: typography.body.fontFamily,
                color: textColor,
              },
              styles?.input,
              style,
            ]}
            {...props}
          />
        </View>
        
        {/* Right Icon */}
        {finalRightIcon && (
          <View className="ml-xs">
            {finalRightIcon}
          </View>
        )}
      </View>
      
      {/* Error/Helper Text - Matching Figma style_PN61H8 */}
      {(error || helperText) && (
        <View className="mt-xs">
          <Text
            variant="bodySmall"
            className={`text-left lowercase ${hasError ? 'text-error-dark' : 'text-theme-text-tertiary'}`}
            style={[
              {
                fontSize: ms(errorSize),
                lineHeight: ms(errorLineHeight),
                color: hasError ? errorTextColor : lightTheme.textTertiary,
              },
              styles?.errorText,
            ]}
          >
            {(error || helperText)?.toLowerCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;

/**
 * OTP Input Component
 * 
 * A reusable 4-digit OTP input component with individual digit boxes.
 * Matches Figma design with proper spacing and styling.
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../primitives/Text';
import { useTranslation } from 'react-i18next';

export interface OTPInputProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  testID?: string;
}

const OTP_LENGTH = 4;

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  error,
  success = false,
  disabled = false,
  autoFocus = false,
  testID,
}) => {
  const { t } = useTranslation();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Ensure value is exactly 4 digits
  const otpDigits = value.padEnd(OTP_LENGTH, ' ').split('').slice(0, OTP_LENGTH);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');
    
    if (digit.length > 1) {
      // Handle paste: take first 6 digits
      const pastedDigits = digit.slice(0, OTP_LENGTH);
      const newValue = pastedDigits.padEnd(OTP_LENGTH, '');
      onChangeText(newValue);
      
      // Focus last input or next empty
      const lastIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);
      inputRefs.current[lastIndex]?.focus();
      setFocusedIndex(lastIndex);
      return;
    }

    if (digit) {
      // Update value at index
      const newValue = value.split('');
      newValue[index] = digit;
      const updatedValue = newValue.join('').slice(0, OTP_LENGTH);
      onChangeText(updatedValue);

      // Move to next input if not last
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      } else {
        // Last digit entered, blur
        inputRefs.current[index]?.blur();
        setFocusedIndex(null);
      }
    } else {
      // Clear current digit
      const newValue = value.split('');
      newValue[index] = '';
      onChangeText(newValue.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleBoxPress = (index: number) => {
    inputRefs.current[index]?.focus();
    setFocusedIndex(index);
  };

  return (
    <View className="w-full items-start">
      <View className="flex-row items-center gap-1 pt-1 px-2 pb-1">
        {otpDigits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const hasError = !!error;
          const hasSuccess = success && value.length === OTP_LENGTH && !hasError;
          const isEmpty = digit === ' ' || digit === '';

          return (
            <TouchableOpacity
              key={index}
              onPress={() => !disabled && handleBoxPress(index)}
              activeOpacity={0.7}
              className={`
                w-[50px] h-[64px] 
                border border-theme-border 
                rounded-sm 
                bg-theme-background 
                justify-center items-center 
                relative
                ${isFocused && !hasSuccess && !hasError ? 'border-2 border-theme-interactive-active' : ''}
                ${hasError ? 'border-error-light' : ''}
                ${hasSuccess ? 'border-2 border-success' : ''}
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit === ' ' ? '' : digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={1}
                editable={!disabled}
                selectTextOnFocus
                className="absolute w-full h-full opacity-0 text-center text-h1"
                testID={testID ? `${testID}-${index}` : undefined}
              />
              {!isEmpty && (
                <View className="justify-center items-center">
                  <Text variant="h1" className="text-theme-text-primary">
                    {digit}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <View className="mt-2">
          <Text variant="caption" className="text-error-dark lowercase">
            {error.toLowerCase()}
          </Text>
        </View>
      )}
      
      {success && value.length === OTP_LENGTH && !error && (
        <View className="mt-2">
          <Text variant="caption" className="text-success">
            {t('auth.otpVerification.success')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OTPInput;


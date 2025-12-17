/**
 * OTP Input Component
 * 
 * A reusable 4-digit OTP input component with individual digit boxes.
 * Matches Figma design with proper spacing and styling.
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ms } from '@/utils/scale';
import { lightTheme, typography } from '@/styles/tokens';
import { Text } from '../primitives/Text';
import { t } from 'i18next';

export interface OTPInputProps {
  /**
   * OTP value (4 digits)
   */
  value: string;
  
  /**
   * Callback when OTP changes
   */
  onChangeText: (value: string) => void;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Success state - shows success styling when OTP is valid
   */
  success?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Auto focus on mount
   */
  autoFocus?: boolean;
  
  /**
   * Test ID for testing
   */
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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Ensure value is exactly 6 digits
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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
              style={[
                styles.digitBox,
                isFocused && !hasSuccess && !hasError && styles.digitBoxFocused,
                hasError && styles.digitBoxError,
                hasSuccess && styles.digitBoxSuccess,
                disabled && styles.digitBoxDisabled,
              ]}
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
                style={styles.input}
                testID={testID ? `${testID}-${index}` : undefined}
              />
              {!isEmpty && (
                <View style={styles.digitText}>
                  <Text
                    style={{
                      fontSize: ms(24),
                      lineHeight: ms(32),
                      fontWeight: '400',
                      fontFamily: typography.h1.fontFamily,
                      color: lightTheme.textPrimary,
                    }}
                  >
                    {digit}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text
            style={{
              fontSize: ms(12),
              lineHeight: ms(16),
              fontWeight: '400',
              fontFamily: typography.caption.fontFamily,
              color: '#D81034',
              textTransform: 'lowercase',
            }}
          >
            {error.toLowerCase()}
          </Text>
        </View>
      )}
      
      {success && value.length === OTP_LENGTH && !error && (
        <View style={styles.successContainer}>
          <Text
            style={{
              fontSize: ms(12),
              lineHeight: ms(16),
              fontWeight: '400',
              fontFamily: typography.caption.fontFamily,
              color: '#28A745',
              textTransform: 'lowercase',
            }}
          >
            {t('auth.otpVerification.success')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: ms(4),
    paddingTop: ms(4),
    paddingRight: ms(8),
    paddingBottom: ms(4),
    paddingLeft: ms(8),
  },
  digitBox: {
    width: ms(50),
    height: ms(64),
    borderWidth: 1,
    borderColor: lightTheme.border, // #DFE0E6 - var(--border-base-tertiary)
    borderRadius: ms(2),
    backgroundColor: lightTheme.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  digitBoxFocused: {
    borderColor: lightTheme.interactiveActive,
    borderWidth: 2,
  },
  digitBoxError: {
    borderColor: '#F3607A',
  },
  digitBoxSuccess: {
    borderColor: '#28A745',
    borderWidth: 2,
  },
  digitBoxDisabled: {
    opacity: 0.5,
  },
  input: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    fontSize: ms(24),
    textAlign: 'center',
  },
  digitText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: ms(8),
  },
  successContainer: {
    marginTop: ms(8),
  },
});

export default OTPInput;


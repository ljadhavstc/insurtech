/**
 * Password Validation Rules Component
 * 
 * Displays password validation rules with real-time feedback.
 * Shows rules as informative initially, then as success/error based on validation.
 * 
 * @example
 * ```tsx
 * <PasswordValidationRules
 *   password={password}
 *   mobileNumber={mobileNumber}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '../primitives/Text';

export interface PasswordValidationRulesProps {
  /**
   * Password value to validate
   */
  password: string;
  
  /**
   * Mobile number to check if password contains it
   */
  mobileNumber?: string;
  
  /**
   * Show rules even when password is empty (informative state)
   */
  showWhenEmpty?: boolean;
}

export interface ValidationRule {
  id: string;
  label: string;
  validate: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  {
    id: 'minLength',
    label: 'at least 1 character',
    validate: (pwd) => pwd.length >= 1,
  },
  {
    id: 'maxLength',
    label: 'at most 25 characters',
    validate: (pwd) => pwd.length <= 25,
  },
  {
    id: 'lowercase',
    label: 'contains at least one lowercase letter',
    validate: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'uppercase',
    label: 'contains at least one uppercase letter',
    validate: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'contains at least one number',
    validate: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: 'specialChar',
    label: 'contains at least one special character',
    validate: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
  },
];

// Note: Mobile number check is handled separately in MobileNumberWarning component

export const PasswordValidationRules: React.FC<PasswordValidationRulesProps> = ({
  password,
  mobileNumber,
  showWhenEmpty = true,
}) => {
  const hasPassword = password.length > 0;
  const shouldShow = showWhenEmpty || hasPassword;

  // Validate all rules
  const ruleResults = useMemo(() => {
    return validationRules.map((rule) => ({
      ...rule,
      isValid: rule.validate(password),
    }));
  }, [password]);

  if (!shouldShow) return null;

  return (
    <View className="gap-xs mt-xs">
      {ruleResults.map((rule) => {
        const isValid = rule.isValid;
        
        // Show informative state when password is empty
        const showInformative = !hasPassword;
        // Show error state when password has value but rule fails
        const showError = hasPassword && !isValid;
        // Show success state when password has value and rule passes
        const showSuccess = hasPassword && isValid;

        return (
          <View key={rule.id} className="flex-row items-center gap-xs">
            {showInformative && (
              <View className="w-4 h-4 items-center justify-center">
                <Text className="text-black text-xs">✓</Text>
              </View>
            )}
            {showError && (
              <View className="w-4 h-4 items-center justify-center">
                <Text className="text-error-dark text-xs">✕</Text>
              </View>
            )}
            {showSuccess && (
              <View className="w-4 h-4 items-center justify-center">
                <Text className="text-success text-xs">✓</Text>
              </View>
            )}
            <Text
              variant="caption"
              className={`
                ${showInformative ? 'text-theme-text-secondary' : ''}
                ${showError ? 'text-error-dark' : ''}
                ${showSuccess ? 'text-success' : ''}
              `}
            >
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default PasswordValidationRules;


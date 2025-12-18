/**
 * Password Strength Meter Component
 * 
 * Displays password strength with a progress bar and strength label.
 * Strength levels:
 * - Invalid: No case matches (0 matches)
 * - Weak: 1 or 2 case matches
 * - Good: 3 case matches (user cannot proceed)
 * - Strong: All cases match (user can proceed)
 * 
 * @example
 * ```tsx
 * <PasswordStrengthMeter password={password} />
 * ```
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '../primitives/Text';
import { baseColors } from '@/styles/tokens';

export interface PasswordStrengthMeterProps {
  /**
   * Password value to evaluate
   */
  password: string;
  
  /**
   * Show label text (default: true)
   */
  showLabel?: boolean;
}

export type PasswordStrength = 'invalid' | 'weak' | 'good' | 'strong';

interface StrengthConfig {
  label: string;
  color: string;
  progress: number; // 0-100
  canProceed: boolean;
}

const strengthConfigs: Record<PasswordStrength, StrengthConfig> = {
  invalid: {
    label: 'Invalid',
    color: baseColors.gray500, // Grey for invalid
    progress: 0,
    canProceed: false,
  },
  weak: {
    label: 'Weak',
    color: baseColors.errorDark, // Red for weak
    progress: 33,
    canProceed: false,
  },
  good: {
    label: 'Good',
    color: baseColors.success, // Green for good
    progress: 66,
    canProceed: false,
  },
  strong: {
    label: 'Strong',
    color: baseColors.success, // Green for strong
    progress: 100,
    canProceed: true,
  },
};

/**
 * Check password strength based on validation cases
 * Cases: lowercase, uppercase, number, special character
 */
const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password || password.length === 0) {
    return 'invalid';
  }

  const cases = [
    /[a-z]/.test(password), // lowercase
    /[A-Z]/.test(password), // uppercase
    /[0-9]/.test(password), // number
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), // special character
  ];

  const matchCount = cases.filter(Boolean).length;

  if (matchCount === 0) {
    return 'invalid';
  } else if (matchCount === 1 || matchCount === 2) {
    return 'weak';
  } else if (matchCount === 3) {
    return 'good';
  } else {
    return 'strong';
  }
};

/**
 * Get strength configuration and whether user can proceed
 */
export const usePasswordStrength = (password: string) => {
  return useMemo(() => {
    const strength = checkPasswordStrength(password);
    const config = strengthConfigs[strength];
    return {
      strength,
      ...config,
    };
  }, [password]);
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showLabel = true,
}) => {
  const { strength, label, color, progress } = usePasswordStrength(password);

  return (
    <View className="gap-xs">
      {/* Progress Bar */}
      <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: color,
            borderRadius: 9999,
          }}
        />
      </View>

      {/* Strength Label */}
      {showLabel && (
        <View className="flex-row items-center gap-xs">
          <Text variant="caption" className="text-theme-text-secondary">
            new password strength:
          </Text>
          <Text
            variant="caption"
            style={{ color }}
            className="font-medium lowercase"
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PasswordStrengthMeter;


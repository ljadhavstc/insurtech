/**
 * Mobile Number Warning Component
 * 
 * Sticky informative bar that appears when password contains mobile number.
 * 
 * @example
 * ```tsx
 * <MobileNumberWarning
 *   password={password}
 *   mobileNumber={mobileNumber}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '../primitives/Text';
import { InfoIcon } from '../icons';
import { s } from '@/utils/scale';

export interface MobileNumberWarningProps {
  /**
   * Password value to check
   */
  password: string;
  
  /**
   * Mobile number to check if password contains it
   */
  mobileNumber?: string;
}

export const MobileNumberWarning: React.FC<MobileNumberWarningProps> = ({
  password,
  mobileNumber,
}) => {
  const shouldShow = useMemo(() => {
    if (!mobileNumber || !password) return false;
    return password.includes(mobileNumber);
  }, [password, mobileNumber]);

  if (!shouldShow) return null;

  return (
    <View
      style={{
        backgroundColor: '#AF8521', // toast-fill-feedback-warning-secondary
        borderRadius: s(2),
        borderLeftWidth: s(4),
        borderLeftColor: '#F9D274',
        width: s(343),
        
        paddingHorizontal: s(12),
        paddingVertical: s(16),
        marginBottom: s(16), // mb-md equivalent
      }}
    >
      <View className="flex-row items-start gap-xs">
        <InfoIcon width={24} height={24} color="#FFFFFF" />
        <View className="flex-1 ml-2">
          <Text variant="caption" className="text-white lowercase">
            your password cannot contain your mobile number
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MobileNumberWarning;


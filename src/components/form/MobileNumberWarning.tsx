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
    <View className="bg-warning/10 border border-warning rounded-md p-md mb-md">
      <View className="flex-row items-start gap-xs">
        <InfoIcon width={20} height={20} color="#FFC107" />
        <View className="flex-1">
          <Text variant="caption" className="text-warning lowercase">
            password should not contain your mobile number
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MobileNumberWarning;


/**
 * Spacer Component
 * 
 * A simple component for adding vertical or horizontal spacing.
 * 
 * @example
 * ```tsx
 * <Spacer height={16} />
 * <Spacer width={8} />
 * ```
 */

import React from 'react';
import { View } from 'react-native';
import { ms } from '@/utils/scale';

export interface SpacerProps {
  /**
   * Vertical spacing in Figma px - will be scaled
   */
  height?: number;
  
  /**
   * Horizontal spacing in Figma px - will be scaled
   */
  width?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ height, width }) => {
  const scaledHeight = height ? ms(height) : undefined;
  const scaledWidth = width ? ms(width) : undefined;

  return (
    <View
      style={{
        height: scaledHeight,
        width: scaledWidth,
      }}
    />
  );
};

export default Spacer;


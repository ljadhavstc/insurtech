/**
 * CheckIcon
 * 
 * Simple checkmark/tick icon for success screens.
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface CheckCircleProps extends SvgProps {
  color?: string;
}

export const CheckCircle: React.FC<CheckCircleProps> = ({
  color = '#14B861', // Success accent green
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* Checkmark/tick */}
      <Path
        d="M4 12L10 18L20 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default CheckCircle;


/**
 * Chevron Down Icon
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG.
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface ChevronDownIconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  color = '#090D0F',
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
      <Path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronDownIcon;


/**
 * Chevron Left Icon
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG.
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface ChevronLeftIconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
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
        d="M15.29 3.29L8.7 9.88C8.31 10.27 8.31 10.9 8.7 11.29L15.29 17.88"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronLeftIcon;


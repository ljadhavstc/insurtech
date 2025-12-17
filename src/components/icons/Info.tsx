/**
 * Info Icon
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG.
 */

import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

export interface InfoIconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
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
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M12 16V12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="8"
        r="1"
        fill={color}
      />
    </Svg>
  );
};

export default InfoIcon;


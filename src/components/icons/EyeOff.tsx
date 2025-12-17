/**
 * Eye Off Icon (Hidden)
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG.
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface EyeOffIconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const EyeOffIcon: React.FC<EyeOffIconProps> = ({
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
        d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C7 20 3.73 16.89 2 12.5C2.94 10.18 4.78 8.06 7.06 6.94M9.9 4.24C10.5883 4.0789 11.2931 3.9984 12 4C17 4 20.27 7.11 22 11.5C21.34 13.35 20.42 15.05 19.26 16.54M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1751 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M1 1L23 23"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeOffIcon;


/**
 * Eye Icon (Visible)
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG (Component 3.svg).
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface EyeIconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const EyeIcon: React.FC<EyeIconProps> = ({
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
      {/* Eye outline */}
      <Path
        d="M2.0625 12.348C1.97917 12.1234 1.97917 11.8764 2.0625 11.6519C2.87416 9.68361 4.25191 8.00066 6.02107 6.81643C7.79024 5.63219 9.87115 5 12 5C14.1288 5 16.2098 5.63219 17.9789 6.81643C19.7481 8.00066 21.1258 9.68361 21.9375 11.6519C22.0208 11.8764 22.0208 12.1234 21.9375 12.348C21.1258 14.3163 19.7481 15.9992 17.9789 17.1834C16.2098 18.3677 14.1288 18.9999 12 18.9999C9.87115 18.9999 7.79024 18.3677 6.02107 17.1834C4.25191 15.9992 2.87416 14.3163 2.0625 12.348Z"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Eye pupil */}
      <Path
        d="M11.9998 15C13.6566 15 14.9997 13.6567 14.9997 11.9997C14.9997 10.3428 13.6566 8.99951 11.9998 8.99951C10.3431 8.99951 9 10.3428 9 11.9997C9 13.6567 10.3431 15 11.9998 15Z"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default EyeIcon;


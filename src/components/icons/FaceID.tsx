/**
 * FaceID Icon
 * 
 * Icon representing Face ID or facial recognition.
 * Shows a face with scanning lines around it.
 */

import React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

export interface FaceIDProps extends SvgProps {
  color?: string;
  backgroundColor?: string;
}

export const FaceID: React.FC<FaceIDProps> = ({
  color = '#090D0F', // Default to primary text color
  backgroundColor = '#F3F3F7', // Default background color
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      {/* Background */}
      <Rect width="48" height="48" fill={backgroundColor} />
      
      {/* Left eye line */}
      <Path
        d="M19.9814 18.8479V20.837"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Right eye line */}
      <Path
        d="M28.2051 18.8479V20.837"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Top left scanning line */}
      <Path
        d="M14 20.682V14H20.6977"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Top right scanning line */}
      <Path
        d="M34 20.682V14H27.3023"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottom left scanning line */}
      <Path
        d="M14 27.318V33.3333C14 33.7015 14.2985 34 14.6667 34H20.6977"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottom right scanning line */}
      <Path
        d="M34 27.318V34H27.3023"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Mouth/smile line */}
      <Path
        d="M19.7119 27.8607C20.7675 28.998 22.2769 29.7099 23.953 29.7099C25.6292 29.7099 27.1386 28.998 28.1942 27.8607"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Nose line */}
      <Path
        d="M22.3174 25.5854C23.235 25.5854 23.9788 24.8433 23.9788 23.9278V21.0702"
        stroke={color}
        strokeWidth="1"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FaceID;


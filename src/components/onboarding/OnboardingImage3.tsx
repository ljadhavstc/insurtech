/**
 * Onboarding Image 3
 * 
 * SVG component for third onboarding slide.
 */

import React from 'react';
import Svg, { Path, Circle, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { s } from '@/utils/scale';

export interface OnboardingImage3Props {
  width?: number;
  height?: number;
}

export const OnboardingImage3: React.FC<OnboardingImage3Props> = ({
  width = s(120),
  height = s(120),
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <Defs>
        <ClipPath id="clip0_465_14960">
          <Rect width="120" height="120" fill="white"/>
        </ClipPath>
        <ClipPath id="clip1_465_14960">
          <Rect width="109.2" height="88.6834" fill="white" transform="translate(5.40039 33.75)"/>
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_465_14960)">
        <G clipPath="url(#clip1_465_14960)">
          <Path d="M93.6541 42.458L83.7109 50.8657V122.058H97.0652V42.2379L93.8692 38.3066L93.6541 42.458Z" fill="white" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M93.6543 42.458V121.623" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M83.876 54.9121L90.9232 58.6783L83.7109 97.0406" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M35.705 109.089L32.669 34.5C32.669 34.5 32.654 35.5203 32.659 37.3209C32.609 35.5203 32.574 34.5 32.559 34.5L29.523 109.089L27.8975 111.65H37.3305L35.705 109.089Z" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M13.583 109.574L11.3923 55.752C11.3923 55.752 11.3823 56.4872 11.3873 57.7876C11.3523 56.4872 11.3273 55.752 11.3173 55.752L9.12655 109.574L7.95117 111.655H14.7584L13.583 109.574Z" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Circle cx="32.6086" cy="80.2497" r="4.2273" fill="white" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Circle cx="60" cy="111.75" r="1.875" fill="white" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M25.7314 77.1636H39.2808" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M25.082 79.7695H39.9318" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Circle cx="11.3472" cy="82.6206" r="2.5718" fill="white" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Circle cx="32.6093" cy="59.8681" r="2.2314" fill="white" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M6.75 111.75L56.25 111.75" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M63.75 111.75L84 111.75" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M71.25 94.5L84 94.5" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
          <Path d="M60 63L60 107.25" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10" strokeDasharray="5.25 5.25"/>
          <Path d="M97.2354 86.6069H114.601" stroke="#4F008D" strokeWidth="0.75" strokeMiterlimit="10"/>
        </G>
        <Path d="M54.4502 17.3672C58.0403 16.0933 61.9597 16.0933 65.5498 17.3672C69.0834 18.6211 72.0859 21.1054 74.001 24.3311C77.3458 29.9649 77.0378 37.109 73.168 42.3916L60 60.3643L46.832 42.3916C42.9622 37.109 42.6542 29.9649 45.999 24.3311C47.9141 21.1054 50.9166 18.6211 54.4502 17.3672Z" stroke="#4F008D" strokeWidth="0.75"/>
        <Circle cx="60" cy="33" r="3.625" stroke="#4F008D" strokeWidth="0.75"/>
      </G>
    </Svg>
  );
};

export default OnboardingImage3;


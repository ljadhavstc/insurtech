/**
 * Onboarding Image 2
 * 
 * SVG component for second onboarding slide.
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { s } from '@/utils/scale';

export interface OnboardingImage2Props {
  width?: number;
  height?: number;
}

export const OnboardingImage2: React.FC<OnboardingImage2Props> = ({
  width = s(120),
  height = s(120),
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <Path d="M8.23242 23.3271V53.6716V59.2872L17.3372 50.2995H53.7467V23.3271H8.23242Z" fill="white" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M40.4708 37.1438L30.9922 27.7822L21.5136 37.1438L30.9922 46.5054L40.4708 37.1438Z" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M112.518 43.7197V86.6592V95.8632L103.199 86.6592H37.9844V43.7197H112.518Z" fill="white" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M103.199 52.9238H71.6797" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M103.199 65.1895H71.6797" stroke="#4F008C" strokeMiterlimit="10"/>
      <Circle cx="56.618" cy="59.6773" r="9.2273" fill="white" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M60.4522 61.5688C59.8223 63.0376 58.3539 64.0645 56.6395 64.0645C55.0704 64.0645 53.7026 63.1995 53.002 61.9259" fill="white"/>
      <Path d="M60.4522 61.5688C59.8223 63.0376 58.3539 64.0645 56.6395 64.0645C55.0704 64.0645 53.7026 63.1995 53.002 61.9259" stroke="#4F008C" strokeMiterlimit="10"/>
      <Circle cx="53.9114" cy="58.2315" r="0.518" fill="#4F008C"/>
      <Circle cx="59.3714" cy="58.2315" r="0.518" fill="#4F008C"/>
      <Path d="M103.199 77.46H47.3037" stroke="#4F008C" strokeMiterlimit="10"/>
      <Path d="M34.0944 35.1414C34.0944 36.1902 33.4516 36.764 32.5801 37.413L31.5801 38.1561L31.4611 38.8663H30.5277L30.6992 37.8034L32.1944 36.6982C32.7658 36.2608 33.1087 35.8704 33.1087 35.2308C33.1087 34.5912 32.6896 34.1397 31.8849 34.1397C30.9611 34.1397 30.4658 34.7652 30.3801 35.5177L30.3563 35.6541H29.3896L29.3992 35.5177C29.5706 34.182 30.4516 33.1943 31.9373 33.1943C33.323 33.1943 34.0992 34.1161 34.0992 35.1367L34.0944 35.1414ZM30.3849 39.948H31.3182L31.1039 41.3072H30.1801L30.3849 39.948Z" fill="#4F008C" stroke="#4F008C" strokeWidth="0.45"/>
    </Svg>
  );
};

export default OnboardingImage2;


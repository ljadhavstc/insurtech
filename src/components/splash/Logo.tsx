/**
 * Splash Screen Logo Component
 * 
 * Two-colored rectangle logo matching Figma design.
 * Uses Tailwind classes for styling.
 */

import React from 'react';
import { View } from 'react-native';
import { s, vs } from '@/utils/scale';

export const SplashLogo: React.FC = () => {
  return (
    <View className="flex-row items-center" style={{ height: vs(7) }}>
      {/* Red rectangle */}
      <View 
        className="bg-brand-red" 
        style={{ width: s(14), height: vs(7) }} 
      />
      {/* White rectangle */}
      <View 
        className="bg-white" 
        style={{ width: s(7), height: vs(7) }} 
      />
    </View>
  );
};

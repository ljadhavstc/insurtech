/**
 * Hook to get current screen dimensions and orientation
 * Automatically updates on orientation change
 * 
 * @example
 * ```tsx
 * import { useScreenDimensions } from '@/utils/useScreenDimensions';
 * 
 * const { width, height, orientation, isLandscape } = useScreenDimensions();
 * ```
 */

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { getOrientation } from './scale';

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      orientation: height > width ? 'portrait' : 'landscape' as 'portrait' | 'landscape',
      isLandscape: height < width,
      isPortrait: height > width,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        orientation: window.height > window.width ? 'portrait' : 'landscape',
        isLandscape: window.height < window.width,
        isPortrait: window.height > window.width,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};


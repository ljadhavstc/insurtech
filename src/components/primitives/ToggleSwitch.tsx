/**
 * Toggle Switch Component
 * 
 * A customizable toggle switch component with primary color for enabled state.
 * Features smooth left-right sliding animation without zoom or other effects.
 */

import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { baseColors } from '@/styles/tokens';
import { ms } from '@/utils/scale';

export interface ToggleSwitchProps {
  /**
   * Whether the switch is enabled/on
   */
  value: boolean;
  
  /**
   * Callback when switch value changes
   */
  onValueChange: (value: boolean) => void;
  
  /**
   * Custom color for enabled state (defaults to primary brand color)
   */
  enabledColor?: string;
  
  /**
   * Custom color for disabled state
   */
  disabledColor?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Additional className
   */
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  enabledColor = baseColors.successActive, // Success color: #34C759
  disabledColor = '#E5E7EB', // Light gray for disabled state
  testID,
  disabled = false,
  className,
}) => {
  // Track width: 51px, thumb size: 27px, padding: 2px
  const TRACK_WIDTH = ms(51);
  const THUMB_SIZE = ms(27); // Match the actual thumb size in styles
  const PADDING = ms(2);
  // Calculate translation: track width - padding (both sides) - thumb size
  const THUMB_TRANSLATE_X = TRACK_WIDTH - (PADDING * 2) - THUMB_SIZE;
  
  const slideAnim = useRef(new Animated.Value(value ? THUMB_TRANSLATE_X : 0)).current;
  const backgroundColorAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    // Animate thumb position (slide left/right)
    Animated.timing(slideAnim, {
      toValue: value ? THUMB_TRANSLATE_X : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate background color change
    Animated.timing(backgroundColorAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, slideAnim, backgroundColorAnim, THUMB_TRANSLATE_X]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [disabledColor, enabledColor],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      className={className}
    >
      <Animated.View
        className="justify-center"
        style={{
          width: ms(51),
          height: ms(31),
          borderRadius: ms(15.5), // Half of height for pill shape
          padding: ms(2),
          backgroundColor,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Animated.View
          className="bg-white rounded-full shadow-sm"
          style={{
            width: ms(27),
            height: ms(27),
            transform: [{ translateX: slideAnim }],
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ToggleSwitch;


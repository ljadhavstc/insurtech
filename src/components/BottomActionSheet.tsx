/**
 * Bottom Action Sheet Component
 * 
 * A reusable bottom action sheet modal for displaying options or prompts.
 * Supports iOS and Android with proper animations.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './primitives/Text';
import { Button } from './primitives/Button';
import { ToggleSwitch } from './primitives/ToggleSwitch';
import { Icon } from './icons';
import { lightTheme } from '@/styles/tokens';
import { ms } from '@/utils/scale';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomActionSheetProps {
  /**
   * Whether the sheet is visible
   */
  visible: boolean;
  
  /**
   * Callback when sheet should be closed
   */
  onClose: () => void;
  
  /**
   * Title of the action sheet
   */
  title?: string;
  
  /**
   * Description/subtitle text
   */
  description?: string;
  
  /**
   * Primary action button text
   */
  primaryActionText?: string;
  
  /**
   * Secondary action button text (optional)
   */
  secondaryActionText?: string;
  
  /**
   * Callback when primary action is pressed
   */
  onPrimaryAction?: () => void;
  
  /**
   * Callback when secondary action is pressed
   */
  onSecondaryAction?: () => void;
  
  /**
   * Custom content to render inside the sheet
   */
  children?: React.ReactNode;
  
  /**
   * Show close button (default: true)
   */
  showCloseButton?: boolean;
  
  /**
   * Biometric login mode - shows toggle switch for enabling biometric login
   */
  biometricMode?: boolean;
  
  /**
   * Whether biometric login is enabled (for biometric mode)
   */
  biometricEnabled?: boolean;
  
  /**
   * Callback when biometric toggle changes (for biometric mode)
   */
  onBiometricToggle?: (enabled: boolean) => void;
  
  /**
   * Label text for biometric option (for biometric mode)
   */
  biometricLabel?: string;
}

export const BottomActionSheet: React.FC<BottomActionSheetProps> = ({
  visible,
  onClose,
  title,
  description,
  primaryActionText,
  secondaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  children,
  showCloseButton = true,
  biometricMode = false,
  biometricEnabled = false,
  onBiometricToggle,
  biometricLabel = 'enable biometric login',
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    onClose();
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-transparent">
          <Animated.View
            className="absolute inset-0 bg-black/50"
            style={{
              opacity: backdropOpacity,
            }}
          />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-transparent"
        style={{
          transform: [{ translateY: slideAnim }],
          zIndex: 1000,
        }}
        pointerEvents="box-none"
      >
        <View
          className="bg-theme-background rounded-t-[20px] pt-3 px-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            maxHeight: SCREEN_HEIGHT * 0.9,
          }}
        >
            {/* Handle bar */}
            <View className="w-10 h-1 bg-theme-border rounded self-center mb-4" />

            {biometricMode ? (
              // Biometric login mode layout
              <>
                {/* Title - centered */}
                <View style={{ marginBottom: ms(24), marginTop: ms(8) }}>
                  <Text variant="screenTitle" className="text-theme-text-primary text-left">
                    {'login with face id'}
                  </Text>
                </View>

                {/* Biometric option row */}
                <View
                  className="flex-row items-center justify-center"
                  style={{
                    marginBottom: ms(24),
                  }}
                >
                  {/* Face ID Icon */}
                  <View
                    className="items-center justify-center"
                    style={{
                      width: ms(24),
                      height: ms(24),
                    }}
                  >
                    <Icon 
                      name="face-id" 
                      size={ms(48)} 
                      color={lightTheme.textPrimary} 
                    />
                  </View>
                  
                  {/* Label */}
                  <Text 
                    variant="body" 
                    className="text-theme-text-primary"
                    style={{
                      marginLeft: ms(25),
                      marginRight: ms(8),
                    }}
                  >
                    {biometricLabel}
                  </Text>
                  
                  {/* Toggle Switch */}
                  <ToggleSwitch
                    value={biometricEnabled}
                    onValueChange={onBiometricToggle || (() => {})}
                    testID="biometric-toggle"
                  />
                </View>

                {/* Continue Button */}
                {primaryActionText && (
                  <View style={{ marginTop: ms(8) }}>
                    <Button  
                      variant="solid"
                      size="medium"
                      onPress={handlePrimaryAction}
                      fullWidth
                    >
                      <Text variant="button" className="text-theme-text-primary text-white">
                        {primaryActionText}
                      </Text>
                    </Button>
                  </View>
                )}
              </>
            ) : (
              // Standard mode layout
              <>
                {/* Header */}
                {(title || showCloseButton) && (
                  <View className="flex-row items-center mb-3">
                    {title && (
                      <Text variant="h3" className="text-theme-text-primary flex-1">
                        {title}
                      </Text>
                    )}
                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        className="w-8 h-8 items-center justify-center"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text variant="body" className="text-theme-text-secondary">
                          ✕
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Description */}
                {description && (
                  <View className="mb-4">
                    <Text variant="bodySmall" className="text-theme-text-secondary">
                      {description}
                    </Text>
                  </View>
                )}

                {/* Custom content */}
                {children && <View className="mb-4">{children}</View>}

                {/* Actions */}
                {(primaryActionText || secondaryActionText) && (
                  <View className="gap-3 mt-2">
                    {secondaryActionText && (
                      <Button
                        variant="ghost"
                        size="medium"
                        onPress={handleSecondaryAction}
                        fullWidth
                      >
                        {secondaryActionText}
                      </Button>
                    )}
                    {primaryActionText && (
                      <Button
                        variant="solid"
                        size="medium"
                        onPress={handlePrimaryAction}
                        fullWidth
                      >
                        {primaryActionText}
                      </Button>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </Animated.View>
    </Modal>
  );
};

export default BottomActionSheet;


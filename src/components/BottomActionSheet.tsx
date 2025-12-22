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
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Text } from './primitives/Text';
import { Button } from './primitives/Button';
import { lightTheme } from '@/styles/tokens';

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
}) => {
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
        <View style={styles.backdrop}>
          <Animated.View
            style={[
              styles.backdropOverlay,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sheetContent}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <Text variant="h3" className="text-theme-text-primary flex-1">
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
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
              <View style={styles.descriptionContainer}>
                <Text variant="bodySmall" className="text-theme-text-secondary">
                  {description}
                </Text>
              </View>
            )}

            {/* Custom content */}
            {children && <View style={styles.childrenContainer}>{children}</View>}

            {/* Actions */}
            {(primaryActionText || secondaryActionText) && (
              <View style={styles.actionsContainer}>
                {secondaryActionText && (
                  <Button
                    variant="ghost"
                    size="medium"
                    onPress={handleSecondaryAction}
                    fullWidth
                    style={styles.secondaryButton}
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
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  sheetContent: {
    backgroundColor: lightTheme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area for iOS
    paddingHorizontal: 16,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: lightTheme.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  childrenContainer: {
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});

export default BottomActionSheet;


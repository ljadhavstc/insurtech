/**
 * Modal Component
 * 
 * A reusable modal component with backdrop and customizable content.
 * 
 * @example
 * ```tsx
 * <Modal visible={isVisible} onClose={handleClose}>
 *   <Text>Modal Content</Text>
 * </Modal>
 * ```
 */

import React from 'react';
import { Modal as RNModal, Pressable, View } from 'react-native';
import { ms } from '@/utils/scale';
import { Box } from './primitives/Box';

export interface ModalProps {
  /**
   * Whether modal is visible
   */
  visible: boolean;
  
  /**
   * Close handler
   */
  onClose: () => void;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Close on backdrop press
   * Default: true
   */
  closeOnBackdropPress?: boolean;
  
  /**
   * Additional Tailwind classes for content container
   */
  contentClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  contentClassName,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box
            className={`bg-white rounded-xl ${contentClassName || ''}`}
            p={24}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            {children}
          </Box>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

export default Modal;


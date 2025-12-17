/**
 * Dropdown Component
 * 
 * A dropdown/select component for forms.
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   options={options}
 *   value={value}
 *   onChange={onChange}
 *   placeholder="Select an option"
 * />
 * ```
 */

import React, { useState } from 'react';
import { Pressable, View, Modal, FlatList } from 'react-native';
import { ms } from '@/utils/scale';
import { Text } from '../primitives/Text';
import { Box } from '../primitives/Box';
import { ChevronDownIcon } from '../icons';
import { lightTheme } from '@/styles/tokens';
import { lightTheme } from '@/styles/tokens';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  /**
   * Options to display
   */
  options: DropdownOption[];
  
  /**
   * Selected value
   */
  value?: string | number;
  
  /**
   * Change handler
   */
  onChange?: (value: string | number) => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  testID,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="w-full">
      {label && (
        <Text
          variant="label"
          className="text-theme-text-primary mb-sm"
        >
          {label}
        </Text>
      )}
      <Pressable
        testID={testID}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`
          flex-row items-center justify-between
          border h-12 rounded-md px-3
          ${error ? 'border-error-light' : 'border-theme-border'}
          bg-theme-background
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        <Text
          variant="body"
          className={selectedOption ? 'text-theme-text-primary' : 'text-theme-text-tertiary'}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDownIcon width={ms(16)} height={ms(16)} color={lightTheme.textTertiary} />
      </Pressable>
      {error && (
        <Text variant="caption" className="text-error-dark mt-xs lowercase">
          {error.toLowerCase()}
        </Text>
      )}
      
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Box className="bg-theme-background rounded-t-xl max-h-96">
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    className={`
                      px-md py-3 border-b border-theme-border
                      ${item.value === value ? 'bg-theme-background-secondary' : ''}
                    `}
                  >
                    <Text
                      variant="body"
                      className={item.value === value ? 'text-theme-interactive-active font-semibold' : 'text-theme-text-primary'}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </Box>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Dropdown;


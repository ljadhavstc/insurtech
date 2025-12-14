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
import { Input } from '../primitives/Input';

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
          size={14}
          className="text-text-primary mb-2"
          style={{ fontWeight: '500' }}
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
          border ${error ? 'border-error' : 'border-border'}
          bg-white
          ${disabled ? 'opacity-50' : ''}
        `}
        style={{
          height: ms(48),
          borderRadius: ms(8),
          paddingHorizontal: ms(12),
        }}
      >
        <Text
          className={selectedOption ? 'text-text-primary' : 'text-text-tertiary'}
          size={16}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Text className="text-text-tertiary" size={16}>
          ▼
        </Text>
      </Pressable>
      {error && (
        <Text size={12} className="text-error mt-1">
          {error}
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
            <Box className="bg-white rounded-t-xl max-h-96">
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    className={`
                      px-4 py-3 border-b border-border
                      ${item.value === value ? 'bg-gray-50' : ''}
                    `}
                  >
                    <Text
                      className={item.value === value ? 'text-primary font-semibold' : 'text-text-primary'}
                      size={16}
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


/**
 * Language Dropdown Component
 * 
 * A compact dropdown for language selection in the header.
 * Shows current language and allows switching between languages.
 * 
 * @example
 * ```tsx
 * <LanguageDropdown />
 * ```
 */

import React, { useState } from 'react';
import { Pressable, Modal, FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from './primitives/Text';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
];

export const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const displayLabel = currentLanguage.code === 'ar' ? currentLanguage.label : 'العربية';

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="min-w-10 min-h-10 justify-center items-center"
      >
        <Text variant="onboardingHeader" className="text-brand-red">
          {displayLabel}
        </Text>
      </Pressable>

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
            <View className="bg-theme-background rounded-t-2xl max-h-[300px] py-xs">
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.code)}
                    className={`
                      px-md py-3 border-b border-theme-border
                      ${item.code === i18n.language ? 'bg-theme-background-secondary' : 'bg-transparent'}
                    `}
                  >
                    <Text
                      variant="body"
                      className={`
                        ${item.code === i18n.language ? 'text-theme-interactive-active font-semibold' : 'text-theme-text-primary'}
                      `}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default LanguageDropdown;


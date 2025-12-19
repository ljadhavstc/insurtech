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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './primitives/Text';
import { ms, vs } from '@/utils/scale';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
];

export const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const displayLabel = currentLanguage.code === 'ar' ? currentLanguage.label : 'العربية';

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Spacing: extra space at top and bottom, positioned slightly above bottom
  const bottomSpacing = Math.max(insets.bottom, vs(24)); // At least 24px from bottom
  const topSpacing = vs(16); // Extra space at top

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
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View 
              className="bg-theme-background rounded-t-2xl"
              style={{
                paddingTop: topSpacing,
                paddingBottom: bottomSpacing,
                marginBottom: vs(16), // Position slightly above bottom
              }}
            >
              {/* Title */}
              <View className="px-md pb-md border-b border-theme-border">
                <Text variant="h3" className="text-theme-text-primary">
                  Select Language
                </Text>
              </View>

              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                contentContainerStyle={{
                  paddingTop: vs(8),
                }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.code)}
                    className={`
                      px-md py-4 border-b border-theme-border
                      ${item.code === i18n.language ? 'bg-theme-background-secondary' : 'bg-transparent'}
                    `}
                    style={{
                      minHeight: vs(56), // Better touch target
                    }}
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


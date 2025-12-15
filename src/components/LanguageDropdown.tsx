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
import { s, ms } from '@/utils/scale';
import { Text } from './primitives/Text';
import { lightTheme, typography } from '@/styles/tokens';

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
        style={{
          minWidth: s(40),
          minHeight: s(40),
          justifyContent: 'center',
          alignItems: 'center',
        }}
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
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setIsOpen(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                backgroundColor: lightTheme.background,
                borderTopLeftRadius: ms(16),
                borderTopRightRadius: ms(16),
                maxHeight: ms(300),
                paddingVertical: ms(8),
              }}
            >
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.code)}
                    style={{
                      paddingHorizontal: ms(16),
                      paddingVertical: ms(12),
                      borderBottomWidth: 1,
                      borderBottomColor: lightTheme.border,
                      backgroundColor: item.code === i18n.language ? lightTheme.backgroundSecondary : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: ms(16),
                        lineHeight: ms(20),
                        fontWeight: item.code === i18n.language ? '600' : '400',
                        fontFamily: typography.body.fontFamily,
                        color: item.code === i18n.language ? lightTheme.interactiveActive : lightTheme.textPrimary,
                      }}
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


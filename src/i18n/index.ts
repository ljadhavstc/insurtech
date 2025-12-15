/**
 * i18n Configuration
 * 
 * Internationalization setup with English, Arabic, and Spanish.
 * Uses react-i18next for translations.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
  es: {
    translation: es,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    compatibilityJSON: 'v3',
  });

export default i18n;


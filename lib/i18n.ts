export enum Locale {
  en = "en",
  es = "es",
}

export const DEFAULT_LOCALE = Locale.en;

export const translations = {
  [Locale.en]: {
    home: {
      title: "Simple i18n example with Next.js Server Actions",
    },
    buttons: {
      en: "English",
      es: "Spanish",
    },
  },
  [Locale.es]: {
    home: {
      title: "Ejemplo simple de i18n con Next.js Server Actions",
    },
    buttons: {
      en: "Inglés",
      es: "Español",
    },
  },
};

export type TranslationKey = keyof (typeof translations)[Locale];

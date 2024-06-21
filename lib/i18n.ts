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
    contact: {
      title: "Contact",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Submit",
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
    contact: {
      title: "Contacto",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      submit: "Enviar",
    },
  },
};

export type TranslationKey = keyof (typeof translations)[Locale];

export function getTranslation(locale: Locale, key: TranslationKey): any {
  const translation = translations[locale][key];
  if (translation) {
    return translation;
  }
  return translations[DEFAULT_LOCALE][key];
}

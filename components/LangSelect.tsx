"use client";

import { useRouter } from "next/navigation";
import i18next from "i18next";
import { languages } from "../lib/i18n/settings";
import { Button } from "./ui/button";

export const LangSelect = ({ currentLanguage }: { currentLanguage: string }) => {
  const router = useRouter();

  const handleChangeLanguage = (e: any, lang: string) => {
    e.preventDefault();
    i18next.changeLanguage(lang);
    router.refresh();
  };
  return (
    <div className="flex space-x-2 items-center">
      {languages.map((lang) => {
        return (
          <span key={lang}>
            <Button type="button" onClick={(e) => handleChangeLanguage(e, lang)}>
              {lang} {currentLanguage === lang ? " (current)" : ""}
            </Button>
          </span>
        );
      })}
    </div>
  );
};

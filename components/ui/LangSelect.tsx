"use client";

import { useRouter } from "next/navigation";
import i18next from "i18next";
import { languages } from "@/app/i18n/settings";
import { Button } from "./button";

export const LangSelect = ({ currentLanguage }: { currentLanguage: string }) => {
  const router = useRouter();

  const handleChangeLanguage = (e: any, lang: string) => {
    e.preventDefault();
    i18next.changeLanguage(lang);
    router.refresh();
  };
  return (
    <div className="flex space-x-2 items-center">
      {languages.map((lang, index) => {
        return (
          <span key={lang}>
            <Button variant="outline" type="button" onClick={(e) => handleChangeLanguage(e, lang)}>
              {lang}
            </Button>
          </span>
        );
      })}
    </div>
  );
};

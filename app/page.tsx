"use server";

import { Button } from "../components/ui/button";
import { toggleTheme } from "./actions";
import { cookies } from "next/headers";
import { getThemeFromCookies, Theme } from "../lib/theme";
import { getServerTranslations } from "../lib/i18n/server";
import { LangSelect } from "../components/LangSelect";

// type Props = {
//   params: { id: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
//   const cookieStore = cookies();
//   const locale = (cookieStore.get("locale")?.value || "en") as Locale;

//   return {
//     title: translations[locale].home.title,
//   };
// }

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("shared.title"),
  };
}

export default async function Index() {
  const { t, i18n } = await getServerTranslations();
  const cookieStore = cookies();
  const theme = getThemeFromCookies(cookieStore);

  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">{t("shared.title")}</h1>
        <div className="flex flex-row justify-center items-center gap-4">
          <LangSelect currentLanguage={i18n.language} />
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <form action={toggleTheme}>
            <Button variant="outline" type="submit">
              {theme === Theme.Light ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

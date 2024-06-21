import { Button } from "@/components/ui/button";
import Link from "next/link";
import { changeLocale } from "./actions";
import { cookies } from "next/headers";
import { Locale, translations } from "@/lib/i18n";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const cookieStore = cookies();
  const locale = (cookieStore.get("locale")?.value || "en") as Locale;

  return {
    title: translations[locale].home.title,
  };
}

export default function Home() {
  const cookieStore = cookies();
  const locale = (cookieStore.get("locale")?.value || "en") as Locale;
  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">
          <span>{translations[locale].home.title}</span>
        </h1>
        <div className="flex flex-row justify-center items-center gap-4">
          <form action={changeLocale} method="post">
            <input type="hidden" name="locale" value="en" />
            <Button variant="outline" type="submit">
              {translations[locale].buttons.en} {locale === "en" && <span className="text-muted-foreground">(Current)</span>}
            </Button>
          </form>
          <form action={changeLocale} method="post">
            <input type="hidden" name="locale" value="es" />
            <Button variant="outline" type="submit">
              {translations[locale].buttons.es} {locale === "es" && <span className="text-muted-foreground">(Current)</span>}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

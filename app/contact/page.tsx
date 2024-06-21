import { Button } from "@/components/ui/button";
import { changeLocale, toggleTheme } from "@/app/actions";
import { cookies } from "next/headers";
import { Locale, translations } from "@/lib/i18n";
import { getThemeFromCookies, Theme } from "@/lib/theme";

export default function Contact() {
  const cookieStore = cookies();
  const locale = (cookieStore.get("locale")?.value || "en") as Locale;
  const theme = getThemeFromCookies(cookieStore);

  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">
          <span>{translations[locale].contact.title}</span>
        </h1>
        <div className="flex flex-row justify-center items-center gap-4">
          <form action={changeLocale} method="post">
            <input type="hidden" name="locale" value="en" />
            <input type="hidden" name="redirectTo" value="/contact" />
            <Button variant="outline" type="submit">
              {translations[locale].buttons.en} {locale === "en" && <span className="text-muted-foreground">(Current)</span>}
            </Button>
          </form>
          <form action={changeLocale} method="post">
            <input type="hidden" name="locale" value="es" />
            <input type="hidden" name="redirectTo" value="/contact" />
            <Button variant="outline" type="submit">
              {translations[locale].buttons.es} {locale === "es" && <span className="text-muted-foreground">(Current)</span>}
            </Button>
          </form>
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <form action={toggleTheme} method="post">
            <input type="hidden" name="redirectTo" value="/contact" />
            <Button variant="outline" type="submit">
              {theme === Theme.Light ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </Button>
          </form>
        </div>
        <div className="mt-8">
          <form>
            <div>
              <label htmlFor="name">{translations[locale].contact.name}</label>
              <input id="name" type="text" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label htmlFor="email">{translations[locale].contact.email}</label>
              <input id="email" type="email" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label htmlFor="message">{translations[locale].contact.message}</label>
              <textarea id="message" className="border rounded p-2 w-full" rows={5}></textarea>
            </div>
            <Button type="submit" className="mt-4">
              {translations[locale].contact.submit}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

import { getServerTranslations } from "@/lib/i18n/server";
import Link from "next/link";
import { LangSelect } from "./LangSelect";
import { toggleTheme } from "@/app/(marketing)/actions";
import { Button } from "./ui/button";
import { cookies } from "next/headers";
import { Theme, getThemeFromCookies } from "@/lib/theme";

export default async function Header() {
  const { t, i18n } = await getServerTranslations();
  const cookieStore = cookies();
  const theme = getThemeFromCookies(cookieStore);
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="flex items-center space-x-2 justify-between">
        <nav>
          <Link href="/" className="mr-4">
            Home
          </Link>
          <Link href="/contact" className="mr-4">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row justify-center items-center gap-4">
            <LangSelect currentLanguage={i18n.language} />
          </div>
          <div className="flex flex-row justify-center items-center gap-4">
            <form action={toggleTheme}>
              <Button type="submit">{theme === Theme.Light ? "Switch to Dark Mode" : "Switch to Light Mode"}</Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}

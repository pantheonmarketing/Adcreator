import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { getThemeFromCookies, Theme } from "@/lib/theme";
import { dir } from "i18next";
import { detectLanguage, getServerTranslations } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/i18n-context";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("shared.title"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lng = await detectLanguage();
  const cookieStore = cookies();
  const theme = getThemeFromCookies(cookieStore);

  return (
    <I18nProvider language={lng}>
      <html lang={lng} dir={dir(lng)} className={theme === Theme.Dark ? "dark" : ""}>
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.style)}>{children}</body>
      </html>
    </I18nProvider>
  );
}

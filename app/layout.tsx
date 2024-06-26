import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { dir } from "i18next";
import { detectLanguage, getServerTranslations } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { getUserInfo } from "@/lib/session";
import clsx from "clsx";
import { Toaster as ReactHostToaster } from "react-hot-toast";

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
  const userInfo = getUserInfo();
  const scheme = userInfo?.scheme || "light";

  return (
    <I18nProvider language={lng}>
      <html lang={lng} dir={dir(lng)} className={scheme === "dark" ? "dark" : ""}>
        <body className={clsx(`theme-${userInfo.theme}`, "max-h-full min-h-screen max-w-full bg-background text-foreground", inter.style)}>
          {children}
          <ReactHostToaster />
        </body>
      </html>
    </I18nProvider>
  );
}

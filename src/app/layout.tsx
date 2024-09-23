import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { dir } from "i18next";
import { detectLanguage, getServerTranslations } from "@/i18n/server";
import { I18nProvider } from "@/i18n/i18n-context";
import { getUserInfo } from "@/lib/services/session.server";
import clsx from "clsx";
import { Toaster as ReactHostToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import ScriptInjector from "@/modules/shared/scripts/ScriptInjector";
import { getRootData } from "@/lib/services/rootData.server";
import RootDataLayout from "@/context/RootDataLayout";
import { defaultSiteTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import ScriptCrisp from "@/modules/shared/scripts/ScriptCrisp";
import ScriptAnalytics from "@/modules/shared/scripts/ScriptAnalytics";
import ScriptRewardful from "@/modules/shared/scripts/ScriptRewardful";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultSiteTags.title,
    icons: [
      { url: "/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    tenant?: string;
  };
}>) {
  const lng = await detectLanguage();
  const userInfo = getUserInfo();
  const scheme = userInfo?.scheme || "light";
  const rootData = await getRootData();

  return (
    <I18nProvider language={lng}>
      <html lang={lng} dir={dir(lng)} className={scheme === "dark" ? "dark" : ""}>
        <body className={clsx(`theme-${userInfo.theme}`, "max-h-full min-h-screen max-w-full bg-background text-foreground", inter.style)}>
          <RootDataLayout data={rootData}>
            {children}
            <ScriptCrisp />
            <ScriptAnalytics />
            <ScriptRewardful />
            <ReactHostToaster />
            <SonnerToaster />
            <ScriptInjector scripts={rootData.appConfiguration?.scripts} />
          </RootDataLayout>
        </body>
      </html>
    </I18nProvider>
  );
}

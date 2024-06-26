"use server";

import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("shared.title"),
  };
}

export default async function Index() {
  const { t } = await getServerTranslations();

  return (
    <main className="h-screen w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="mx-auto w-full space-y-4">
        <h1 className="flex justify-center space-x-2 text-2xl font-bold">{t("shared.title")}</h1>
      </div>
    </main>
  );
}

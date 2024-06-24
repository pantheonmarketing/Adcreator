"use server";

import { getServerTranslations } from "../lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: t("shared.title"),
  };
}

export default async function Index() {
  const { t } = await getServerTranslations();

  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">{t("shared.title")}</h1>
      </div>
    </main>
  );
}

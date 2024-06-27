import { ContactPage } from "./ContactPage";

import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return await ContactPage.metadata({ t });
}

export default async function Contact() {
  const data = await ContactPage.load();
  const blocks = await ContactPage.blocks({ data });
  return blocks.map((block) => block.render);
}

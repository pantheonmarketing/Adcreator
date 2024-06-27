import { getServerTranslations } from "@/i18n/server";
import PageBlocks from "@/modules/pageBlocks/blocks/PageBlocks";
import { LandingPage } from "@/modules/pageBlocks/pages/LandingPage";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return await LandingPage.metatags({ t });
}

export default async function Index() {
  // const data = await LandingPage.load();
  const { t } = await getServerTranslations();
  return <PageBlocks items={LandingPage.blocks({ data: {}, t })} />;
}

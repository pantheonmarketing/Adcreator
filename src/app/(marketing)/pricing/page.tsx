"use server";

import PageBlocks from "@/modules/pageBlocks/blocks/PageBlocks";
import { PricingBlockService } from "@/modules/pageBlocks/blocks/marketing/pricing/PricingBlockService.server";
import { getServerTranslations } from "@/i18n/server";
import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import { PricingPage } from "@/modules/pageBlocks/pages/PricingPage";
import { revalidatePath } from "next/cache";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return PricingPage.metatags({ t });
}

const loader = async ({ searchParams }: IServerComponentsProps) => {
  const { t } = await getServerTranslations();
  const data: PricingPage.LoaderData = {
    metatags: PricingPage.metatags({ t }),
    pricingBlockData: await PricingBlockService.load({ searchParams }),
  };
  return data;
};

export const actionPricing = async (prev: any, form: FormData) => {
  const { t } = await getServerTranslations();
  const action = form.get("action");
  if (action === "subscribe") {
    const response = await PricingBlockService.subscribe({ form, t });
    revalidatePath("/pricing");
    return response;
  }
};

export default async function (props: IServerComponentsProps) {
  const { t } = await getServerTranslations();
  const data = await loader(props);
  return <PageBlocks items={PricingPage.blocks({ data, t })} />;
}

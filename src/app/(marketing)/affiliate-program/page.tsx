import HeaderBlock from "@/modules/pageBlocks/blocks/marketing/header/HeaderBlock";
import FooterBlock from "@/modules/pageBlocks/blocks/marketing/footer/FooterBlock";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getAppConfiguration } from "@/modules/core/services/AppConfigurationService";
import Page404 from "@/components/pages/Page404";
import { defaultAppConfiguration } from "@/modules/core/data/defaultAppConfiguration";
import { getServerTranslations } from "@/i18n/server";
import AffiliateProgramComponent from "./component";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return getMetaTags({
    title: `${t("affiliates.program")} | ${defaultSiteTags.title}`,
    description: t("affiliates.description"),
  });
}

export type AffiliateProgramDataDto = {
  contactEmail: string;
  affiliates: {
    percentage: number;
    plans: { title: string; price: number }[];
    signUpLink: string;
  };
};
const loader = async (): Promise<AffiliateProgramDataDto | null> => {
  const appConfiguration = await getAppConfiguration();
  let affiliatesConfig = appConfiguration.affiliates;
  if (!affiliatesConfig) {
    return null;
  }
  if (!affiliatesConfig?.provider.rewardfulApiKey) {
    throw Error("[Affiliates] Rewardful API key is not set.");
  } else if (!affiliatesConfig?.percentage) {
    throw Error("[Affiliates] Percentage is not set.");
  } else if (!affiliatesConfig?.plans || affiliatesConfig.plans.length === 0) {
    throw Error("[Affiliates] Plans are not set.");
  } else if (!affiliatesConfig?.signUpLink) {
    throw Error("[Affiliates] SignUp link is not set.");
  }
  return {
    contactEmail: defaultAppConfiguration.email.supportEmail,
    affiliates: {
      percentage: affiliatesConfig.percentage,
      plans: affiliatesConfig.plans,
      signUpLink: affiliatesConfig.signUpLink,
    },
  };
};

export default async function () {
  const { t } = await getServerTranslations();
  const data = await loader();
  if (!data) {
    return <Page404 />;
  }
  return (
    <div>
      <div>
        <HeaderBlock />
        <div className="bg-background">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:align-center sm:flex sm:flex-col">
              <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-2 py-12 sm:py-6">
                <div className="mb-10 text-center">
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("affiliates.program")}</h1>
                  <h2 className="mt-4 text-lg leading-6 text-muted-foreground">{t("affiliates.description")}</h2>
                </div>
                <div className="mx-auto max-w-3xl space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{t("affiliates.how.title")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("affiliates.how.description", { 0: data.affiliates.percentage })}</p>
                  </div>

                  <AffiliateProgramComponent data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterBlock />
      </div>
    </div>
  );
}

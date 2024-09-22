"use server";

import { getServerTranslations } from "@/i18n/server";
import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import { getCurrentUrl } from "@/lib/services/url.server";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getAcquiredItemsFromCheckoutSession } from "@/modules/subscriptions/services/PricingService";
import { persistCheckoutSessionStatus } from "@/modules/subscriptions/services/SubscriptionService";
import { RegisterForm } from "@/modules/accounts/components/auth/RegisterForm";
import Logo from "@/components/brand/Logo";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return getMetaTags({
    title: `${t("account.register.setup")} | ${defaultSiteTags.title}`,
  });
}

const loader = async ({ params }: IServerComponentsProps) => {
  const { t } = await getServerTranslations();

  await persistCheckoutSessionStatus({
    id: params?.session ?? "",
    fromUrl: getCurrentUrl(),
  });
  const checkoutSession = await getAcquiredItemsFromCheckoutSession(params?.session ?? "");

  if (!checkoutSession) {
    return { error: t("settings.subscription.checkout.invalid") };
  } else if (!checkoutSession.status?.pending) {
    return { error: t("settings.subscription.checkout.alreadyProcessed") };
  }

  return {
    checkoutSession,
  };
};

export default async function ({ params }: IServerComponentsProps) {
  const { t } = await getServerTranslations();
  const data = await loader({ params });

  return (
    <div>
      <div className="">
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-sm space-y-5">
            <Logo className="mx-auto h-12 w-auto" />

            <div className="flex flex-col items-center">
              {data.error ? (
                <>
                  <h1 className="text-left text-2xl font-extrabold">Unexpected Error</h1>
                  <p className="mt-1 text-center text-sm text-red-500">{data.error}</p>
                </>
              ) : !data.checkoutSession ? (
                <>
                  <h1 className="text-left text-2xl font-extrabold">Error</h1>
                  <p className="mt-1 text-center text-sm text-red-500">Invalid checkout session</p>
                </>
              ) : (
                <>
                  <h1 className="text-left text-2xl font-extrabold">{t("account.register.setup")}</h1>
                  <p className="mt-1 text-center text-sm">Thank you for subscribing to {t(data.checkoutSession.products.map((f) => t(f.title)).join(", "))}</p>
                </>
              )}
            </div>

            {data.checkoutSession && !data.error && (
              <RegisterForm
                data={{
                  email: data.checkoutSession.customer.email,
                }}
                isSettingUpAccount={true}
                checkoutSessionId={params?.session}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

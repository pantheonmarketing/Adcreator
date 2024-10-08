"use server";

import { db } from "@/db";
import { TenantSubscriptionWithDetailsDto } from "@/db/models";
import { getServerTranslations } from "@/i18n/server";
import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import { getUserInfo } from "@/lib/services/session.server";
import { getBaseURL, getCurrentUrl } from "@/lib/services/url.server";
import { getTenant, getTenantIdFromUrl } from "@/modules/accounts/services/TenantService";
import { getUser } from "@/modules/accounts/services/UserService";
import { defaultSiteTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { verifyUserHasPermission } from "@/modules/permissions/services/UserPermissionsService";
import { SubscriptionProductDto } from "@/modules/subscriptions/dtos/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "@/modules/subscriptions/enums/SubscriptionBillingPeriod";
import { stripeService } from "@/modules/subscriptions/services/StripeService";
import { getActiveTenantSubscriptions, getPlanFromForm, persistCheckoutSessionStatus } from "@/modules/subscriptions/services/SubscriptionService";
import { getOrPersistTenantSubscription, updateTenantSubscription } from "@/modules/subscriptions/services/TenantSubscriptionService";
import PricingUtils from "@/modules/subscriptions/utils/PricingUtils";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Component from "./component";
import { requireAuth } from "@/lib/services/loaders.middleware";
import { addTenantProductsFromCheckoutSession, getAcquiredItemsFromCheckoutSession } from "@/modules/subscriptions/services/PricingService";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: `${t("pricing.subscribe")} | ${defaultSiteTags.title}`,
  };
}

export type AppSubscribeTenantSuccessLoaderData = {
  checkoutSession: { customer: { email: string }; products: { title: string }[] } | null;
  error?: string;
};

const loader = async ({ params }: IServerComponentsProps) => {
  const { t } = await getServerTranslations();
  const tenantId = await getTenantIdFromUrl(params?.tenant!);
  const userInfo = getUserInfo();
  await requireAuth({ tenantSlug: params?.tenant });

  const user = await getUser(userInfo.userId!);
  if (!user) {
    throw redirect(`/login`);
  }
  const tenant = await getTenant(tenantId);
  if (!tenant) {
    throw redirect(`/app`);
  }

  await persistCheckoutSessionStatus({
    id: params?.session ?? "",
    fromUrl: getCurrentUrl(),
    fromUserId: user.id,
    fromTenantId: tenant.id,
  });
  const checkoutSession = await getAcquiredItemsFromCheckoutSession(params?.session ?? "");

  const data: AppSubscribeTenantSuccessLoaderData = {
    checkoutSession,
  };

  if (checkoutSession) {
    try {
      await addTenantProductsFromCheckoutSession({
        tenantId: tenantId,
        user,
        checkoutSession,
        createdUserId: null,
        createdTenantId: null,
        t,
      });
      await Promise.all(
        checkoutSession.products.map(async (product) => {
          // await createLog(request, tenantId, "Subscribed", t(product.title ?? ""));
        })
      );
      return data;
      // return redirect(`/subscribe/${params.tenant}/${params.product}/success`);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
      return { ...data, error: e.message };
    }
  }
  return data;
};

export default async function (props: IServerComponentsProps) {
  const data = await loader(props);
  return <Component data={data} />;
}

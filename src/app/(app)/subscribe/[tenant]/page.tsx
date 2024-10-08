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
import { getActiveTenantSubscriptions, getPlanFromForm } from "@/modules/subscriptions/services/SubscriptionService";
import { getOrPersistTenantSubscription, updateTenantSubscription } from "@/modules/subscriptions/services/TenantSubscriptionService";
import PricingUtils from "@/modules/subscriptions/utils/PricingUtils";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Component from "./component";
import { requireAuth } from "@/lib/services/loaders.middleware";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return {
    title: `${t("pricing.subscribe")} | ${defaultSiteTags.title}`,
  };
}

export type AppSubscribeTenantLoaderData = {
  currentTenant: { id: string; slug: string };
  mySubscription: TenantSubscriptionWithDetailsDto | null;
  items: SubscriptionProductDto[];
  coupon?: { error?: string; stripeCoupon?: Stripe.Coupon | null };
  currenciesAndPeriod: {
    currencies: { value: string; options: string[] };
    billingPeriods: { value: SubscriptionBillingPeriod; options: SubscriptionBillingPeriod[] };
  };
};

const loader = async ({ params, searchParams }: IServerComponentsProps) => {
  const { t } = await getServerTranslations();
  const tenantId = await getTenantIdFromUrl(params?.tenant!);
  const userInfo = getUserInfo();
  await requireAuth({ tenantSlug: params?.tenant });

  const user = await getUser(userInfo.userId!);
  if (!user) {
    throw redirect(`/login`);
  }
  const currentTenant = await getTenant(tenantId);
  if (!currentTenant) {
    throw redirect(`/app`);
  }

  let items = await db.subscriptionProduct.getAllSubscriptionProducts(true);
  const planParam = searchParams?.plan?.toString();
  if (planParam) {
    items = await db.subscriptionProduct.getSubscriptionProductsInIds([planParam]);
  }

  const couponParam = searchParams?.coupon?.toString();
  let coupon: { error?: string; stripeCoupon?: Stripe.Coupon | null } | undefined = undefined;
  if (couponParam) {
    try {
      const stripeCoupon = await stripeService.getStripeCoupon(couponParam);
      if (!stripeCoupon) {
        throw Error(t("pricing.coupons.invalid"));
      }
      if (stripeCoupon.max_redemptions && stripeCoupon.times_redeemed > stripeCoupon.max_redemptions) {
        throw Error(t("pricing.coupons.expired"));
      }
      if (!stripeCoupon.valid) {
        throw Error(t("pricing.coupons.invalid"));
      }
      coupon = { stripeCoupon };
    } catch (e: any) {
      coupon = { error: e.message };
    }
  }

  const defaultCurrency = PricingUtils.getDefaultCurrency(searchParams);
  const defaultBillingPeriod = PricingUtils.getDefaultBillingPeriod(searchParams);

  const data: AppSubscribeTenantLoaderData = {
    items,
    coupon,
    currentTenant,
    mySubscription: await getActiveTenantSubscriptions(tenantId),
    currenciesAndPeriod: PricingUtils.getCurrenciesAndPeriods(
      items.flatMap((f) => f.prices),
      defaultCurrency,
      defaultBillingPeriod
    ),
  };
  return data;
};

export const actionAppSubscribeTenant = async (prev: any, form: FormData) => {
  const { t } = await getServerTranslations();
  const userInfo = getUserInfo();

  const tenantSlug = form.get("tenantSlug")?.toString();
  const tenantId = await getTenantIdFromUrl(tenantSlug || "");
  if (!tenantId) {
    return { error: "Invalid tenant ID" };
  }
  await requireAuth({ tenantSlug });
  verifyUserHasPermission("app.settings.subscription.update", tenantId);

  const tenantSubscription = await getOrPersistTenantSubscription(tenantId);
  const user = await getUser(userInfo.userId!);
  const tenant = await getTenant(tenantId);

  if (!tenantSubscription.stripeCustomerId && user && tenant) {
    const customer = await stripeService.createStripeCustomer(user.email, tenant.name);
    if (customer) {
      tenantSubscription.stripeCustomerId = customer.id;
      await updateTenantSubscription(tenant.id, {
        stripeCustomerId: customer.id,
      });
    }
  }

  const action = form.get("action");

  if (!tenantSubscription || !tenantSubscription?.stripeCustomerId) {
    return { error: "Invalid stripe customer" };
  }

  if (action === "subscribe") {
    const selectedPlan = await getPlanFromForm(form);
    const response = await stripeService
      .createStripeCheckoutSession({
        subscriptionProduct: selectedPlan.product,
        customer: tenantSubscription.stripeCustomerId,
        line_items: selectedPlan.line_items,
        mode: selectedPlan.mode,
        success_url: `${getBaseURL()}/subscribe/${tenantSlug}/{CHECKOUT_SESSION_ID}/success`,
        cancel_url: `${getCurrentUrl()}`,
        freeTrialDays: selectedPlan.freeTrialDays,
        coupon: selectedPlan.coupon,
        referral: selectedPlan.referral,
      })
      .then((session) => {
        return session;
      })
      .catch((e) => {
        console.log(e);
        return { error: e.message };
      });
    if ("error" in response) {
      return { error: response.error };
    }
    return redirect(response.url ?? "");
  }
};

export default async function (props: IServerComponentsProps) {
  const data = await loader(props);
  return <Component data={data} />;
}

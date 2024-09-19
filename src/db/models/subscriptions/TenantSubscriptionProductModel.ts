import { SubscriptionFeatureModel } from "./SubscriptionFeatureModel";
import { SubscriptionPriceModel } from "./SubscriptionPriceModel";
import { SubscriptionProductModel } from "./SubscriptionProductModel";
import { SubscriptionUsageBasedPriceModel } from "./SubscriptionUsageBasedPriceModel";
import { SubscriptionUsageBasedTierModel } from "./SubscriptionUsageBasedTierModel";
import { TenantSubscriptionProductPriceModel } from "./TenantSubscriptionProductPrice";

export type TenantSubscriptionProductModel = {
  id: string;
  createdAt: Date;
  tenantSubscriptionId: string;
  subscriptionProductId: string;
  cancelledAt: Date | null;
  endsAt: Date | null;
  stripeSubscriptionId: string | null;
  quantity: number | null;
  fromCheckoutSessionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
};

export type TenantSubscriptionProductWithDetailsDto = TenantSubscriptionProductModel & {
  subscriptionProduct: SubscriptionProductModel & { features: SubscriptionFeatureModel[] };
  prices: (TenantSubscriptionProductPriceModel & {
    subscriptionPrice: SubscriptionPriceModel | null;
    subscriptionUsageBasedPrice: SubscriptionUsageBasedPriceModel | null;
    // | (SubscriptionUsageBasedPriceModel & {
    //     tiers: SubscriptionUsageBasedTierModel[];
    //   })
    // | null;
  })[];
};

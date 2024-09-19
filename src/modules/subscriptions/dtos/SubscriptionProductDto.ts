import { SubscriptionPriceDto } from "./SubscriptionPriceDto";
import { SubscriptionFeatureDto } from "./SubscriptionFeatureDto";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";
import { SubscriptionUsageBasedPriceDto } from "./SubscriptionUsageBasedPriceDto";
import { TenantSubscriptionProductModel } from "@/db/models";

export interface SubscriptionProductDto {
  id?: string;
  stripeId: string;
  order: number;
  title: string;
  description: string | null;
  groupTitle?: string | null;
  groupDescription?: string | null;
  badge: string | null;
  active: boolean;
  model: PricingModel;
  public: boolean;
  prices: SubscriptionPriceDto[];
  features: SubscriptionFeatureDto[];
  translatedTitle?: string;
  usageBasedPrices?: SubscriptionUsageBasedPriceDto[];
  tenantProducts?: TenantSubscriptionProductModel[];
  billingAddressCollection?: string | null;
  hasQuantity?: boolean;
  canBuyAgain?: boolean;
}

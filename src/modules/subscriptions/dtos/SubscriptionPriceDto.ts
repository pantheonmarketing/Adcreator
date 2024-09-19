import { SubscriptionProductDto } from "./SubscriptionProductDto";
import { SubscriptionPriceType } from "@/modules/subscriptions/enums/SubscriptionPriceType";
import { SubscriptionBillingPeriod } from "@/modules/subscriptions/enums/SubscriptionBillingPeriod";
import { SubscriptionUsageBasedTierModel } from "@/db/models";
import { Decimal } from "decimal.js";

export interface SubscriptionPriceDto {
  id?: string;
  stripeId: string;
  type: SubscriptionPriceType;
  billingPeriod: SubscriptionBillingPeriod;
  price: number | Decimal;
  currency: string;
  trialDays: number;
  active: boolean;
  priceBefore?: number;
  subscriptionProductId: string;
  subscriptionProduct?: SubscriptionProductDto;
  usageBasedPrices?: SubscriptionUsageBasedTierModel[];
}

import Decimal from "decimal.js";

export type SubscriptionPriceModel = {
  id: string;
  subscriptionProductId: string;
  stripeId: string;
  type: number;
  billingPeriod: number;
  price: Decimal;
  currency: string;
  trialDays: number;
  active: boolean;
};

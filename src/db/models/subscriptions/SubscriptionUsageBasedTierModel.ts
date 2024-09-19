import Decimal from "decimal.js";

export type SubscriptionUsageBasedTierModel = {
  id: string;
  subscriptionUsageBasedPriceId: string;
  from: number;
  to: number | null;
  perUnitPrice: Decimal | null;
  flatFeePrice: Decimal | null;
};

import { TenantSubscriptionProductModel } from "../../models";

export interface ITenantSubscriptionProductDb {
  get(id: string): Promise<TenantSubscriptionProductModel | null>;

  getByStripeSubscriptionId(stripeSubscriptionId: string): Promise<TenantSubscriptionProductModel | null>;

  create(data: {
    tenantSubscriptionId: string;
    subscriptionProductId: string;
    stripeSubscriptionId?: string;
    quantity?: number;
    fromCheckoutSessionId?: string | null;
    prices: {
      subscriptionPriceId?: string;
      subscriptionUsageBasedPriceId?: string;
    }[];
  }): Promise<string>;

  update(
    id: string,
    data: {
      cancelledAt?: Date | null;
      endsAt?: Date | null;
      currentPeriodStart?: Date | null;
      currentPeriodEnd?: Date | null;
    }
  ): Promise<void>;
}

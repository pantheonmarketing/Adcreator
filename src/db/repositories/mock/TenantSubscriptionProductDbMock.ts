import { mockDb } from "@/db/config/mock/data/mockDb";
import { ITenantSubscriptionProductDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionProductDb";
import { TenantSubscriptionProductModel } from "@/db/models";

export class TenantSubscriptionProductDbMock implements ITenantSubscriptionProductDb {
  get(id: string): Promise<TenantSubscriptionProductModel | null> {
    return Promise.resolve(mockDb.tenantSubscriptionProduct[0]);
  }
  getByStripeSubscriptionId(stripeSubscriptionId: string): Promise<TenantSubscriptionProductModel | null> {
    return Promise.resolve(mockDb.tenantSubscriptionProduct[0]);
  }
  create(data: {
    tenantSubscriptionId: string;
    subscriptionProductId: string;
    stripeSubscriptionId?: string;
    quantity?: number;
    fromCheckoutSessionId?: string | null;
    prices: { subscriptionPriceId?: string; subscriptionUsageBasedPriceId?: string }[];
  }): Promise<string> {
    return Promise.resolve("1");
  }
  update(
    id: string,
    data: {
      cancelledAt?: Date | null;
      endsAt?: Date | null;
      currentPeriodStart?: Date | null;
      currentPeriodEnd?: Date | null;
    }
  ): Promise<void> {
    return Promise.resolve();
  }
}

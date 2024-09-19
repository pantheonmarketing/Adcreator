import { db } from "@/db";
import { TenantSubscriptionWithDetailsDto } from "@/db/models";
import { clearCacheKey } from "@/lib/services/cache.server";
import { clearSubscriptionsCache } from "./SubscriptionService";

export async function getOrPersistTenantSubscription(tenantId: string): Promise<TenantSubscriptionWithDetailsDto> {
  const subscription = await db.tenantSubscription.get(tenantId);

  if (subscription) {
    return subscription;
  }
  const id = await createTenantSubscription(tenantId, "");
  const item = await db.tenantSubscription.get(id);
  if (!item) {
    throw new Error("Could not create tenant subscription");
  }
  return item;
}

export async function createTenantSubscription(tenantId: string, stripeCustomerId: string): Promise<string> {
  const id = await db.tenantSubscription
    .create({
      tenantId,
      stripeCustomerId,
    })
    .then((item) => {
      clearCacheKey(`tenantSubscription:${tenantId}`);
      return item;
    });
  return id;
}

export async function updateTenantSubscription(tenantId: string, data: { stripeCustomerId: string }): Promise<void> {
  await db.tenantSubscription
    .update(tenantId, {
      stripeCustomerId: data.stripeCustomerId,
    })
    .then((item) => {
      clearCacheKey(`tenantSubscription:${tenantId}`);
      return item;
    });
}

export async function createTenantSubscriptionProduct(data: {
  tenantSubscriptionId: string;
  subscriptionProductId: string;
  stripeSubscriptionId?: string;
  quantity?: number;
  fromCheckoutSessionId?: string | null;
  prices: {
    subscriptionPriceId?: string;
    subscriptionUsageBasedPriceId?: string;
  }[];
}): Promise<string> {
  const id = await db.tenantSubscriptionProduct
    .create({
      tenantSubscriptionId: data.tenantSubscriptionId,
      subscriptionProductId: data.subscriptionProductId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      quantity: data.quantity,
      fromCheckoutSessionId: data.fromCheckoutSessionId,
      prices: data.prices.map((price) => ({
        subscriptionPriceId: price.subscriptionPriceId,
        subscriptionUsageBasedPriceId: price.subscriptionUsageBasedPriceId,
      })),
    })
    .then(async (id) => {
      const tenantSubscription = await db.tenantSubscription.get(data.tenantSubscriptionId);
      if (tenantSubscription) {
        clearCacheKey(`tenantSubscription:${tenantSubscription.tenantId}`);
      }
      return id;
    });
  return id;
}

export async function cancelTenantSubscriptionProduct(id: string, data: { cancelledAt: Date | null; endsAt: Date | null }): Promise<void> {
  await clearSubscriptionsCache();
  return await db.tenantSubscriptionProduct
    .update(id, {
      cancelledAt: data.cancelledAt,
      endsAt: data.endsAt,
    })
    .then(async () => {
      const tenantSubscriptionProduct = await db.tenantSubscriptionProduct.get(id);
      if (tenantSubscriptionProduct?.tenantSubscriptionId) {
        const tenantSubscription = await db.tenantSubscription.get(tenantSubscriptionProduct?.tenantSubscriptionId);
        if (tenantSubscription?.tenantId) {
          clearCacheKey(`tenantSubscription:${tenantSubscription.tenantId}`);
        }
      }
    });
}

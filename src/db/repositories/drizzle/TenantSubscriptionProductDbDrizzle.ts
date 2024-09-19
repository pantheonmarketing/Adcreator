import { eq } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { TenantSubscriptionProduct, TenantSubscriptionProductPrice } from "@/db/config/drizzle/schema";
import { ITenantSubscriptionProductDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionProductDb";
import { TenantSubscriptionProductModel } from "@/db/models";
import { createId } from "@paralleldrive/cuid2";

export class TenantSubscriptionProductDbDrizzle implements ITenantSubscriptionProductDb {
  async get(id: string): Promise<TenantSubscriptionProductModel | null> {
    const results = await drizzleDb.select().from(TenantSubscriptionProduct).where(eq(TenantSubscriptionProduct.id, id));
    return results[0] || null;
  }

  async getByStripeSubscriptionId(stripeSubscriptionId: string): Promise<TenantSubscriptionProductModel | null> {
    const results = await drizzleDb.select().from(TenantSubscriptionProduct).where(eq(TenantSubscriptionProduct.stripeSubscriptionId, stripeSubscriptionId));
    return results[0] || null;
  }

  async create(data: {
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
    const id = createId();
    await drizzleDb.transaction(async (tx) => {
      await tx.insert(TenantSubscriptionProduct).values({
        id,
        tenantSubscriptionId: data.tenantSubscriptionId,
        subscriptionProductId: data.subscriptionProductId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        quantity: data.quantity,
        fromCheckoutSessionId: data.fromCheckoutSessionId,
        endsAt: null,
        cancelledAt: null,
        createdAt: new Date(),
      });

      for (const price of data.prices) {
        await tx.insert(TenantSubscriptionProductPrice).values({
          id: createId(),
          tenantSubscriptionProductId: id,
          subscriptionPriceId: price.subscriptionPriceId,
          subscriptionUsageBasedPriceId: price.subscriptionUsageBasedPriceId,
          // createdAt: new Date(),
        });
      }
    });

    return id;
  }

  async update(
    id: string,
    data: {
      cancelledAt?: Date | null;
      endsAt?: Date | null;
      currentPeriodStart?: Date | null;
      currentPeriodEnd?: Date | null;
    }
  ): Promise<void> {
    await drizzleDb
      .update(TenantSubscriptionProduct)
      .set({
        cancelledAt: data.cancelledAt,
        endsAt: data.endsAt,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        // updatedAt: new Date(),
      })
      .where(eq(TenantSubscriptionProduct.id, id));
  }
}

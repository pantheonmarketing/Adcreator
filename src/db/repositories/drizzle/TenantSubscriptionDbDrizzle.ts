import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { TenantSubscription, TenantSubscriptionUsageRecord } from "@/db/config/drizzle/schema";
import { ITenantSubscriptionDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionDb";
import { TenantSubscriptionWithDetailsDto } from "@/db/models";

export class TenantSubscriptionDbDrizzle implements ITenantSubscriptionDb {
  async getAll(): Promise<TenantSubscriptionWithDetailsDto[]> {
    return await drizzleDb.query.TenantSubscription.findMany({
      with: {
        products: {
          with: {
            subscriptionProduct: {
              with: {
                features: true,
              },
            },
            prices: {
              with: {
                subscriptionPrice: true,
                subscriptionUsageBasedPrice: {
                  with: {
                    tiers: true,
                  },
                },
              },
            },
          },
          orderBy: (products, { desc }) => [desc(products.createdAt)],
        },
      },
    });
  }

  async get(tenantId: string): Promise<TenantSubscriptionWithDetailsDto | null> {
    const subscriptions = await drizzleDb.query.TenantSubscription.findMany({
      where: eq(TenantSubscription.tenantId, tenantId),
      with: {
        products: {
          with: {
            subscriptionProduct: {
              with: {
                features: true,
              },
            },
            prices: {
              with: {
                subscriptionPrice: true,
                subscriptionUsageBasedPrice: true,
              },
            },
          },
          orderBy: (products, { desc }) => [desc(products.createdAt)],
        },
      },
    });

    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  async create(data: { tenantId: string; stripeCustomerId: string }): Promise<string> {
    const id = createId();
    const [result] = await drizzleDb
      .insert(TenantSubscription)
      .values({
        id,
        tenantId: data.tenantId,
        stripeCustomerId: data.stripeCustomerId,
      })
      .returning({ tenantId: TenantSubscription.tenantId });

    return result.tenantId;
  }

  async update(tenantId: string, data: { stripeCustomerId: string }): Promise<void> {
    await drizzleDb
      .update(TenantSubscription)
      .set({
        stripeCustomerId: data.stripeCustomerId,
      })
      .where(eq(TenantSubscription.tenantId, tenantId));
  }

  async createUsageRecord(data: {
    tenantSubscriptionProductPriceId: string;
    timestamp: number;
    quantity: number;
    stripeSubscriptionItemId: string;
  }): Promise<string> {
    const id = createId();
    const [result] = await drizzleDb
      .insert(TenantSubscriptionUsageRecord)
      .values({
        id,
        tenantSubscriptionProductPriceId: data.tenantSubscriptionProductPriceId,
        timestamp: data.timestamp,
        quantity: data.quantity,
        stripeSubscriptionItemId: data.stripeSubscriptionItemId,
      })
      .returning({ id: TenantSubscriptionUsageRecord.id });

    return result.id;
  }
}

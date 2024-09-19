import { and, eq, inArray, desc, asc } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import {
  SubscriptionProduct,
  SubscriptionPrice,
  SubscriptionUsageBasedPrice,
  SubscriptionUsageBasedTier,
  SubscriptionFeature,
} from "@/db/config/drizzle/schema";
import { ISubscriptionProductDb } from "@/db/interfaces/subscriptions/ISubscriptionProductDb";
import { SubscriptionProductDto } from "@/modules/subscriptions/dtos/SubscriptionProductDto";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";
import { SubscriptionPriceModel, SubscriptionProductModel, SubscriptionUsageBasedPriceModel, SubscriptionUsageBasedTierModel } from "@/db/models";
import { createId } from "@paralleldrive/cuid2";

export class SubscriptionProductDbDrizzle implements ISubscriptionProductDb {
  async getAllSubscriptionProductsWithTenants(): Promise<SubscriptionProductDto[]> {
    return await drizzleDb.query.SubscriptionProduct.findMany({
      with: {
        tenantProducts: true,
        usageBasedPrices: {
          with: {
            tiers: { orderBy: asc(SubscriptionUsageBasedTier.from) },
          },
        },
        prices: true,
        features: {
          orderBy: asc(SubscriptionFeature.order),
        },
      },
      orderBy: asc(SubscriptionProduct.order),
    });
  }

  async getAllSubscriptionProducts(isPublic?: boolean): Promise<SubscriptionProductDto[]> {
    let whereClause: any = eq(SubscriptionProduct.active, true);
    if (isPublic) {
      whereClause = and(whereClause, eq(SubscriptionProduct.public, true));
    }

    return await drizzleDb.query.SubscriptionProduct.findMany({
      where: whereClause,
      with: {
        tenantProducts: true,
        usageBasedPrices: {
          with: {
            tiers: { orderBy: asc(SubscriptionUsageBasedTier.from) },
          },
        },
        prices: true,
        features: {
          orderBy: asc(SubscriptionFeature.order),
        },
      },
      orderBy: asc(SubscriptionProduct.order),
    });
  }

  async getSubscriptionProductsInIds(ids: string[]): Promise<SubscriptionProductDto[]> {
    return await drizzleDb.query.SubscriptionProduct.findMany({
      where: inArray(SubscriptionProduct.id, ids),
      with: {
        tenantProducts: true,
        usageBasedPrices: {
          with: {
            tiers: { orderBy: asc(SubscriptionUsageBasedTier.from) },
          },
        },
        prices: true,
        features: {
          orderBy: asc(SubscriptionFeature.order),
        },
      },
      orderBy: asc(SubscriptionProduct.order),
    });
  }

  async getSubscriptionProduct(id: string): Promise<SubscriptionProductDto | null> {
    const products = await drizzleDb.query.SubscriptionProduct.findMany({
      where: eq(SubscriptionProduct.id, id),
      with: {
        tenantProducts: true,
        usageBasedPrices: {
          with: {
            tiers: { orderBy: asc(SubscriptionUsageBasedTier.from) },
          },
        },
        prices: true,
        features: {
          orderBy: asc(SubscriptionFeature.order),
        },
      },
    });
    return products[0] || null;
  }

  async getSubscriptionPriceByStripeId(stripeId: string): Promise<SubscriptionPriceModel | null> {
    const prices = await drizzleDb.query.SubscriptionPrice.findMany({
      where: eq(SubscriptionPrice.stripeId, stripeId),
      with: {
        subscriptionProduct: true,
      },
    });
    return prices[0] || null;
  }

  async getSubscriptionUsageBasedPriceByStripeId(stripeId: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    const prices = await drizzleDb.query.SubscriptionUsageBasedPrice.findMany({
      where: eq(SubscriptionUsageBasedPrice.stripeId, stripeId),
    });
    return prices[0] || null;
  }

  async createSubscriptionProduct(data: Omit<SubscriptionProductModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(SubscriptionProduct).values({
      id,
      ...data,
    });
    return id;
  }

  async updateSubscriptionProduct(
    id: string,
    data: {
      stripeId?: string;
      order: number;
      title: string;
      model: PricingModel;
      description?: string | null;
      badge?: string | null;
      groupTitle?: string | null;
      groupDescription?: string | null;
      public: boolean;
      billingAddressCollection: string;
      hasQuantity?: boolean;
      canBuyAgain?: boolean;
    }
  ): Promise<void> {
    await drizzleDb
      .update(SubscriptionProduct)
      .set({
        ...data,
      })
      .where(eq(SubscriptionProduct.id, id));
  }

  async updateSubscriptionProductStripeId(id: string, data: { stripeId: string }): Promise<void> {
    await drizzleDb
      .update(SubscriptionProduct)
      .set({
        stripeId: data.stripeId,
      })
      .where(eq(SubscriptionProduct.id, id));
  }

  async updateSubscriptionPriceStripeId(id: string, data: { stripeId: string }): Promise<void> {
    await drizzleDb
      .update(SubscriptionPrice)
      .set({
        stripeId: data.stripeId,
      })
      .where(eq(SubscriptionPrice.id, id));
  }

  async createSubscriptionPrice(data: Omit<SubscriptionPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(SubscriptionPrice).values({
      id,
      ...data,
    });
    return id;
  }

  async getSubscriptionUsageBasedPrice(id: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    const prices = await drizzleDb.query.SubscriptionUsageBasedPrice.findMany({
      where: eq(SubscriptionUsageBasedPrice.id, id),
    });
    return prices[0] || null;
  }

  async createSubscriptionUsageBasedPrice(data: Omit<SubscriptionUsageBasedPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(SubscriptionUsageBasedPrice).values({
      id,
      ...data,
    });
    return id;
  }

  async createSubscriptionUsageBasedTier(data: Omit<SubscriptionUsageBasedTierModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(SubscriptionUsageBasedTier).values({
      id,
      ...data,
    });
    return id;
  }

  async deleteSubscriptionProduct(id: string): Promise<void> {
    await drizzleDb.delete(SubscriptionProduct).where(eq(SubscriptionProduct.id, id));
  }

  async deleteSubscriptionPrice(id: string): Promise<void> {
    await drizzleDb.delete(SubscriptionPrice).where(eq(SubscriptionPrice.id, id));
  }

  async deleteSubscriptionUsageBasedTier(id: string): Promise<void> {
    await drizzleDb.delete(SubscriptionUsageBasedTier).where(eq(SubscriptionUsageBasedTier.id, id));
  }

  async deleteSubscriptionUsageBasedPrice(id: string): Promise<void> {
    await drizzleDb.delete(SubscriptionUsageBasedPrice).where(eq(SubscriptionUsageBasedPrice.id, id));
  }
}

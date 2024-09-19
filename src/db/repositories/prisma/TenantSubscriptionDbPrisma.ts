import { prisma } from "@/db/config/prisma/database";
import { ITenantSubscriptionDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionDb";
import { TenantSubscriptionWithDetailsDto } from "@/db/models";

export class TenantSubscriptionDbPrisma implements ITenantSubscriptionDb {
  async getAll(): Promise<TenantSubscriptionWithDetailsDto[]> {
    return await prisma.tenantSubscription.findMany({
      include: {
        products: {
          include: {
            subscriptionProduct: { include: { features: true } },
            prices: { include: { subscriptionPrice: true, subscriptionUsageBasedPrice: { include: { tiers: true } } } },
          },
          orderBy: {
            subscriptionProduct: {
              order: "desc",
            },
          },
        },
      },
    });
  }

  async get(tenantId: string): Promise<TenantSubscriptionWithDetailsDto | null> {
    return await prisma.tenantSubscription.findUnique({
      where: {
        tenantId,
      },
      include: {
        products: {
          include: {
            subscriptionProduct: { include: { features: true } },
            prices: {
              include: {
                subscriptionPrice: true,
                subscriptionUsageBasedPrice: true,
              },
            },
          },
          orderBy: {
            subscriptionProduct: {
              order: "desc",
            },
          },
        },
      },
    });
  }

  async create(data: { tenantId: string; stripeCustomerId: string }): Promise<string> {
    const item = await prisma.tenantSubscription.create({
      data: {
        tenantId: data.tenantId,
        stripeCustomerId: data.stripeCustomerId,
      },
    });
    return item.tenantId;
  }

  async update(tenantId: string, data: { stripeCustomerId: string }): Promise<void> {
    await prisma.tenantSubscription.update({
      where: {
        tenantId,
      },
      data: {
        stripeCustomerId: data.stripeCustomerId,
      },
    });
  }

  async createUsageRecord(data: {
    tenantSubscriptionProductPriceId: string;
    timestamp: number;
    quantity: number;
    stripeSubscriptionItemId: string;
  }): Promise<string> {
    const item = await prisma.tenantSubscriptionUsageRecord.create({
      data: {
        tenantSubscriptionProductPriceId: data.tenantSubscriptionProductPriceId,
        timestamp: data.timestamp,
        quantity: data.quantity,
        stripeSubscriptionItemId: data.stripeSubscriptionItemId,
      },
    });
    return item.id;
  }
}

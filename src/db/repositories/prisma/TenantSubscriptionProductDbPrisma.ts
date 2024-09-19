import { prisma } from "@/db/config/prisma/database";
import { ITenantSubscriptionProductDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionProductDb";
import { TenantSubscriptionProductModel } from "@/db/models";

export class TenantSubscriptionProductDbPrisma implements ITenantSubscriptionProductDb {
  async get(id: string): Promise<TenantSubscriptionProductModel | null> {
    return await prisma.tenantSubscriptionProduct.findUnique({
      where: {
        id,
      },
    });
  }

  async getByStripeSubscriptionId(stripeSubscriptionId: string): Promise<TenantSubscriptionProductModel | null> {
    return await prisma.tenantSubscriptionProduct.findFirst({
      where: {
        stripeSubscriptionId,
      },
    });
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
    const item = await prisma.tenantSubscriptionProduct.create({
      data: {
        tenantSubscriptionId: data.tenantSubscriptionId,
        subscriptionProductId: data.subscriptionProductId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        quantity: data.quantity,
        fromCheckoutSessionId: data.fromCheckoutSessionId,
        endsAt: null,
        cancelledAt: null,
        prices: {
          create: data.prices.map((price) => ({
            subscriptionPriceId: price.subscriptionPriceId,
            subscriptionUsageBasedPriceId: price.subscriptionUsageBasedPriceId,
          })),
        },
      },
      include: { tenantSubscription: true },
    });

    return item.id;
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
    await prisma.tenantSubscriptionProduct.update({
      where: {
        id,
      },
      data: {
        cancelledAt: data.cancelledAt,
        endsAt: data.endsAt,
      },
    });
  }
}

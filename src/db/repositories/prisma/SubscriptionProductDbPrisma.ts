import { prisma } from "@/db/config/prisma/database";
import { ISubscriptionProductDb } from "@/db/interfaces/subscriptions/ISubscriptionProductDb";
import { SubscriptionPriceModel, SubscriptionProductModel, SubscriptionUsageBasedPriceModel, SubscriptionUsageBasedTierModel } from "@/db/models";
import { SubscriptionProductDto } from "@/modules/subscriptions/dtos/SubscriptionProductDto";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";

export class SubscriptionProductDbPrisma implements ISubscriptionProductDb {
  async getAllSubscriptionProductsWithTenants(): Promise<SubscriptionProductDto[]> {
    return await prisma.subscriptionProduct
      .findMany({
        include: {
          tenantProducts: true,
          usageBasedPrices: { include: { tiers: { orderBy: { from: "asc" } } } },
          prices: true,
          features: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      })
      .catch(() => {
        return [];
      });
  }

  async getAllSubscriptionProducts(isPublic?: boolean): Promise<SubscriptionProductDto[]> {
    if (isPublic) {
      return await prisma.subscriptionProduct
        .findMany({
          where: {
            active: true,
            public: true,
          },
          include: {
            tenantProducts: true,
            usageBasedPrices: { include: { tiers: { orderBy: { from: "asc" } } } },
            prices: true,
            features: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        })
        .catch(() => {
          return [];
        });
    }
    return await prisma.subscriptionProduct
      .findMany({
        where: {
          active: true,
        },
        include: {
          tenantProducts: true,
          usageBasedPrices: { include: { tiers: { orderBy: { from: "asc" } } } },
          prices: true,
          features: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      })
      .catch(() => {
        return [];
      });
  }

  async getSubscriptionProductsInIds(ids: string[]): Promise<SubscriptionProductDto[]> {
    return await prisma.subscriptionProduct.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        tenantProducts: true,
        usageBasedPrices: { include: { tiers: { orderBy: { from: "asc" } } } },
        prices: true,
        features: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: { order: "asc" },
    });
  }

  async getSubscriptionProduct(id: string): Promise<SubscriptionProductDto | null> {
    return await prisma.subscriptionProduct.findUnique({
      where: {
        id,
      },
      include: {
        tenantProducts: true,
        usageBasedPrices: { include: { tiers: { orderBy: { from: "asc" } } } },
        prices: true,
        features: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async getSubscriptionPriceByStripeId(stripeId: string): Promise<SubscriptionPriceModel | null> {
    return await prisma.subscriptionPrice
      .findFirst({
        where: { stripeId },
        include: {
          subscriptionProduct: true,
        },
      })
      .catch(() => {
        return null;
      });
  }

  async getSubscriptionUsageBasedPriceByStripeId(stripeId: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    return await prisma.subscriptionUsageBasedPrice
      .findFirstOrThrow({
        where: { stripeId },
      })
      .catch(() => {
        return null;
      });
  }

  async createSubscriptionProduct(data: Omit<SubscriptionProductModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item = await prisma.subscriptionProduct.create({
      data: {
        stripeId: data.stripeId,
        order: data.order,
        title: data.title,
        model: data.model,
        description: data.description,
        badge: data.badge,
        groupTitle: data.groupTitle,
        groupDescription: data.groupDescription,
        active: data.active,
        public: data.public,
        billingAddressCollection: data.billingAddressCollection,
        hasQuantity: data.hasQuantity,
        canBuyAgain: data.canBuyAgain,
      },
    });
    return item.id;
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
    await prisma.subscriptionProduct.update({
      where: {
        id,
      },
      data: {
        stripeId: data.stripeId,
        order: data.order,
        title: data.title,
        model: data.model,
        description: data.description,
        badge: data.badge,
        groupTitle: data.groupTitle,
        groupDescription: data.groupDescription,
        public: data.public,
        billingAddressCollection: data.billingAddressCollection,
        hasQuantity: data.hasQuantity,
        canBuyAgain: data.canBuyAgain,
      },
    });
  }

  async updateSubscriptionProductStripeId(id: string, data: { stripeId: string }): Promise<void> {
    await prisma.subscriptionProduct.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateSubscriptionPriceStripeId(id: string, data: { stripeId: string }): Promise<void> {
    await prisma.subscriptionPrice.update({
      where: {
        id,
      },
      data,
    });
  }

  async createSubscriptionPrice(data: Omit<SubscriptionPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item = await prisma.subscriptionPrice.create({ data });
    return item.id;
  }

  async getSubscriptionUsageBasedPrice(id: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    return await prisma.subscriptionUsageBasedPrice.findUnique({
      where: {
        id,
      },
    });
  }

  async createSubscriptionUsageBasedPrice(data: Omit<SubscriptionUsageBasedPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item = await prisma.subscriptionUsageBasedPrice.create({ data });
    return item.id;
  }

  async createSubscriptionUsageBasedTier(data: Omit<SubscriptionUsageBasedTierModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item = await prisma.subscriptionUsageBasedTier.create({ data });
    return item.id;
  }

  async deleteSubscriptionProduct(id: string): Promise<void> {
    await prisma.subscriptionProduct.delete({
      where: {
        id,
      },
    });
  }

  async deleteSubscriptionPrice(id: string): Promise<void> {
    await prisma.subscriptionPrice.delete({
      where: {
        id,
      },
    });
  }

  async deleteSubscriptionUsageBasedTier(id: string): Promise<void> {
    await prisma.subscriptionUsageBasedTier.delete({
      where: {
        id,
      },
    });
  }

  async deleteSubscriptionUsageBasedPrice(id: string): Promise<void> {
    await prisma.subscriptionUsageBasedPrice.delete({
      where: {
        id,
      },
    });
  }
}

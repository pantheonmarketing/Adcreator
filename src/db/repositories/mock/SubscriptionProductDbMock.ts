import { mockDb } from "@/db/config/mock/data/mockDb";
import { ICheckoutSessionStatusDb } from "@/db/interfaces/subscriptions/ICheckoutSessionStatusDb";
import { ISubscriptionProductDb } from "@/db/interfaces/subscriptions/ISubscriptionProductDb";
import {
  CheckoutSessionStatusModel,
  SubscriptionPriceModel,
  SubscriptionProductModel,
  SubscriptionUsageBasedPriceModel,
  SubscriptionUsageBasedTierModel,
} from "@/db/models";
import { SubscriptionProductDto } from "@/modules/subscriptions/dtos/SubscriptionProductDto";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";

export class SubscriptionProductDbMock implements ISubscriptionProductDb {
  toDto(item: SubscriptionProductModel): SubscriptionProductDto {
    return {
      ...item,
      prices: [],
      features: [],
    };
  }
  getAllSubscriptionProductsWithTenants(): Promise<SubscriptionProductDto[]> {
    return Promise.resolve(mockDb.subscriptionProduct.map((sp) => this.toDto(sp)));
  }
  getAllSubscriptionProducts(isPublic?: boolean): Promise<SubscriptionProductDto[]> {
    return Promise.resolve(mockDb.subscriptionProduct.map((sp) => this.toDto(sp)));
  }
  getSubscriptionProductsInIds(ids: string[]): Promise<SubscriptionProductDto[]> {
    return Promise.resolve(mockDb.subscriptionProduct.filter((sp) => ids.includes(sp.id)).map((sp) => this.toDto(sp)));
  }
  getSubscriptionProduct(id: string): Promise<SubscriptionProductDto | null> {
    const item = mockDb.subscriptionProduct.find((sp) => sp.id === id);
    return item ? Promise.resolve(this.toDto(item)) : Promise.resolve(null);
  }
  getSubscriptionPriceByStripeId(stripeId: string): Promise<SubscriptionPriceModel | null> {
    return Promise.resolve(null);
  }
  getSubscriptionUsageBasedPriceByStripeId(stripeId: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    return Promise.resolve(null);
  }
  createSubscriptionProduct(data: Omit<SubscriptionProductModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    return Promise.resolve("1");
  }
  updateSubscriptionProduct(
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
    return Promise.resolve();
  }
  updateSubscriptionProductStripeId(id: string, data: { stripeId: string }): Promise<void> {
    return Promise.resolve();
  }
  updateSubscriptionPriceStripeId(id: string, data: { stripeId: string }): Promise<void> {
    return Promise.resolve();
  }
  createSubscriptionPrice(data: Omit<SubscriptionPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    return Promise.resolve("1");
  }
  getSubscriptionUsageBasedPrice(id: string): Promise<SubscriptionUsageBasedPriceModel | null> {
    return Promise.resolve(null);
  }
  createSubscriptionUsageBasedPrice(data: Omit<SubscriptionUsageBasedPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    return Promise.resolve("1");
  }
  createSubscriptionUsageBasedTier(data: Omit<SubscriptionUsageBasedTierModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    return Promise.resolve("1");
  }
  deleteSubscriptionProduct(id: string): Promise<void> {
    return Promise.resolve();
  }
  deleteSubscriptionPrice(id: string): Promise<void> {
    return Promise.resolve();
  }
  deleteSubscriptionUsageBasedTier(id: string): Promise<void> {
    return Promise.resolve();
  }
  deleteSubscriptionUsageBasedPrice(id: string): Promise<void> {
    return Promise.resolve();
  }
}

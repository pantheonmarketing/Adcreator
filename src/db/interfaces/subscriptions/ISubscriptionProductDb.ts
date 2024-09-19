import { SubscriptionPriceModel, SubscriptionProductModel, SubscriptionUsageBasedPriceModel, SubscriptionUsageBasedTierModel } from "@/db/models";
import { SubscriptionProductDto } from "@/modules/subscriptions/dtos/SubscriptionProductDto";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";

export interface ISubscriptionProductDb {
  getAllSubscriptionProductsWithTenants(): Promise<SubscriptionProductDto[]>;

  getAllSubscriptionProducts(isPublic?: boolean): Promise<SubscriptionProductDto[]>;

  getSubscriptionProductsInIds(ids: string[]): Promise<SubscriptionProductDto[]>;

  getSubscriptionProduct(id: string): Promise<SubscriptionProductDto | null>;

  getSubscriptionPriceByStripeId(stripeId: string): Promise<SubscriptionPriceModel | null>;

  getSubscriptionUsageBasedPriceByStripeId(stripeId: string): Promise<SubscriptionUsageBasedPriceModel | null>;

  createSubscriptionProduct(data: Omit<SubscriptionProductModel, "id" | "createdAt" | "updatedAt">): Promise<string>;

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
  ): Promise<void>;

  updateSubscriptionProductStripeId(id: string, data: { stripeId: string }): Promise<void>;

  updateSubscriptionPriceStripeId(id: string, data: { stripeId: string }): Promise<void>;

  createSubscriptionPrice(data: Omit<SubscriptionPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string>;

  getSubscriptionUsageBasedPrice(id: string): Promise<SubscriptionUsageBasedPriceModel | null>;

  createSubscriptionUsageBasedPrice(data: Omit<SubscriptionUsageBasedPriceModel, "id" | "createdAt" | "updatedAt">): Promise<string>;

  createSubscriptionUsageBasedTier(data: Omit<SubscriptionUsageBasedTierModel, "id" | "createdAt" | "updatedAt">): Promise<string>;

  deleteSubscriptionProduct(id: string): Promise<void>;

  deleteSubscriptionPrice(id: string): Promise<void>;

  deleteSubscriptionUsageBasedTier(id: string): Promise<void>;

  deleteSubscriptionUsageBasedPrice(id: string): Promise<void>;
}

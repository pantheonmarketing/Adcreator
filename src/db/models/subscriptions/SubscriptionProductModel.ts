import { TenantSubscriptionProductWithDetailsDto } from "./TenantSubscriptionProductModel";

export type SubscriptionProductModel = {
  id: string;
  stripeId: string;
  order: number;
  title: string;
  active: boolean;
  model: number;
  public: boolean;
  groupTitle: string | null;
  groupDescription: string | null;
  description: string | null;
  badge: string | null;
  billingAddressCollection: string;
  hasQuantity: boolean;
  canBuyAgain: boolean;
};

export type SubscriptionProductWithDetailsDto = SubscriptionProductModel & {
  products: TenantSubscriptionProductWithDetailsDto[];
};

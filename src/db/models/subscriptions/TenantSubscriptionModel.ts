import { TenantSubscriptionProductWithDetailsDto } from "./TenantSubscriptionProductModel";

export type TenantSubscriptionModel = {
  id: string;
  tenantId: string;
  stripeCustomerId: string | null;
};

export type TenantSubscriptionWithDetailsDto = TenantSubscriptionModel & {
  products: TenantSubscriptionProductWithDetailsDto[];
};

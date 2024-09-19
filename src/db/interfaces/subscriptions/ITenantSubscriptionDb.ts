import { TenantSubscriptionWithDetailsDto } from "../../models";

export interface ITenantSubscriptionDb {
  getAll(): Promise<TenantSubscriptionWithDetailsDto[]>;
  get(tenantId: string): Promise<TenantSubscriptionWithDetailsDto | null>;
  create(data: { tenantId: string; stripeCustomerId: string }): Promise<string>;
  update(tenantId: string, data: { stripeCustomerId: string }): Promise<void>;
  createUsageRecord(data: { tenantSubscriptionProductPriceId: string; timestamp: number; quantity: number; stripeSubscriptionItemId: string }): Promise<string>;
}

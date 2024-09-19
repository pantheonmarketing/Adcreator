export type TenantSubscriptionUsageRecordModel = {
  id: string;
  tenantSubscriptionProductPriceId: string;
  timestamp: number;
  quantity: number;
  stripeSubscriptionItemId: string | null;
};

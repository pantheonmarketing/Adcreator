import { TenantSubscriptionModel, TenantSubscriptionWithDetailsDto } from "../../models";
import { mockDb } from "../../config/mock/data/mockDb";
import { ITenantSubscriptionDb } from "@/db/interfaces/subscriptions/ITenantSubscriptionDb";

export class TenantSubscriptionDbMock implements ITenantSubscriptionDb {
  withDetails(item: TenantSubscriptionModel): TenantSubscriptionWithDetailsDto {
    return {
      ...item,
      products: [],
    };
  }
  getAll(): Promise<TenantSubscriptionWithDetailsDto[]> {
    return Promise.resolve(mockDb.tenantSubscription.map((t) => this.withDetails(t)));
  }
  get(tenantId: string): Promise<TenantSubscriptionWithDetailsDto | null> {
    const item = mockDb.tenantSubscription.find((t) => t.tenantId === tenantId);
    return item ? Promise.resolve(this.withDetails(item)) : Promise.resolve(null);
  }
  create(data: { tenantId: string; stripeCustomerId: string }): Promise<string> {
    mockDb.tenantSubscription.push({
      ...data,
      id: "100",
    });
    return Promise.resolve("100");
  }
  update(tenantId: string, data: { stripeCustomerId: string }): Promise<void> {
    mockDb.tenantSubscription = mockDb.tenantSubscription.map((item) => {
      return item.tenantId === tenantId ? { ...item, ...data } : item;
    });
    return Promise.resolve();
  }
  async createUsageRecord(data: {
    tenantSubscriptionProductPriceId: string;
    timestamp: number;
    quantity: number;
    stripeSubscriptionItemId: string;
  }): Promise<string> {
    return Promise.resolve("1");
  }
}

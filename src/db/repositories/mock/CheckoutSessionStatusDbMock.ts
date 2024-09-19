import { mockDb } from "@/db/config/mock/data/mockDb";
import { ICheckoutSessionStatusDb } from "@/db/interfaces/subscriptions/ICheckoutSessionStatusDb";
import { CheckoutSessionStatusModel } from "@/db/models";

export class CheckoutSessionStatusDbMock implements ICheckoutSessionStatusDb {
  get(id: string): Promise<CheckoutSessionStatusModel | null> {
    return Promise.resolve(mockDb.checkoutSessionStatus[0]);
  }
  create(data: { id: string; email: string; fromUrl: string; fromUserId?: string | null; fromTenantId?: string | null }): Promise<string> {
    return Promise.resolve("1");
  }
  update(id: string, data: { pending: boolean; createdUserId?: string | null; createdTenantId?: string | null }): Promise<void> {
    return Promise.resolve();
  }
}

import { CheckoutSessionStatusModel } from "@/db/models";

export interface ICheckoutSessionStatusDb {
  get(id: string): Promise<CheckoutSessionStatusModel | null>;
  create(data: { id: string; email: string; fromUrl: string; fromUserId?: string | null; fromTenantId?: string | null }): Promise<string>;
  update(id: string, data: { pending: boolean; createdUserId?: string | null; createdTenantId?: string | null }): Promise<void>;
}

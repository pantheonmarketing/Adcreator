import { eq } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { CheckoutSessionStatus } from "@/db/config/drizzle/schema";
import { ICheckoutSessionStatusDb } from "@/db/interfaces/subscriptions/ICheckoutSessionStatusDb";
import { CheckoutSessionStatusModel } from "@/db/models";

export class CheckoutSessionStatusDbDrizzle implements ICheckoutSessionStatusDb {
  async get(id: string): Promise<CheckoutSessionStatusModel | null> {
    const results = await drizzleDb.select().from(CheckoutSessionStatus).where(eq(CheckoutSessionStatus.id, id)).limit(1);
    return results.length > 0 ? results[0] : null;
  }

  async create(data: { id: string; email: string; fromUrl: string; fromUserId?: string | null; fromTenantId?: string | null }): Promise<string> {
    await drizzleDb.insert(CheckoutSessionStatus).values({
      id: data.id,
      pending: true,
      email: data.email,
      fromUrl: data.fromUrl,
      fromUserId: data.fromUserId ?? null,
      fromTenantId: data.fromTenantId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return data.id;
  }

  async update(id: string, data: { pending: boolean; createdUserId?: string | null; createdTenantId?: string | null }): Promise<void> {
    await drizzleDb
      .update(CheckoutSessionStatus)
      .set({
        pending: data.pending,
        createdUserId: data.createdUserId ?? null,
        createdTenantId: data.createdTenantId ?? null,
        updatedAt: new Date(),
      })
      .where(eq(CheckoutSessionStatus.id, id));
  }
}

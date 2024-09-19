import { createId } from "@paralleldrive/cuid2";
import { and, eq, sql, SQL } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { TenantUserInvitation, Tenant } from "@/db/config/drizzle/schema";
import { ITenantUserInvitationDb } from "@/db/interfaces/accounts/ITenantUserInvitationDb";
import { TenantUserInvitationWithTenantDto, TenantUserInvitationModel } from "@/db/models";

export class TenantUserInvitationDbDrizzle implements ITenantUserInvitationDb {
  async get(id: string): Promise<TenantUserInvitationWithTenantDto | null> {
    const items = await drizzleDb.query.TenantUserInvitation.findMany({
      where: eq(TenantUserInvitation.id, id),
      with: {
        tenant: true,
      },
    });
    return items.length === 0 ? null : items[0];
  }

  async getPending(tenantId: string): Promise<TenantUserInvitationModel[]> {
    return drizzleDb.query.TenantUserInvitation.findMany({
      where: and(eq(TenantUserInvitation.tenantId, tenantId), eq(TenantUserInvitation.pending, true)),
    });
  }

  async create(data: Omit<TenantUserInvitationModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(TenantUserInvitation).values({
      id,
      tenantId: data.tenantId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      pending: data.pending,
      createdUserId: data.createdUserId,
      fromUserId: data.fromUserId,
    });
    return id;
  }

  async update(id: string, data: { pending?: boolean }): Promise<void> {
    await drizzleDb
      .update(TenantUserInvitation)
      .set({
        pending: data.pending,
      })
      .where(eq(TenantUserInvitation.id, id))
      .execute();
  }

  async del(id: string): Promise<void> {
    await drizzleDb.delete(TenantUserInvitation).where(eq(TenantUserInvitation.id, id)).execute();
  }
}

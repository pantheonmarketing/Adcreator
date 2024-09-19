import { createId } from "@paralleldrive/cuid2";
import { and, eq, gte, lt, count } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { TenantUser } from "@/db/config/drizzle/schema";
import { ITenantUserDb } from "@/db/interfaces/accounts/ITenantUserDb";
import { TenantUserModel, TenantUserWithUserDto } from "@/db/models";

export class TenantUserDbDrizzle implements ITenantUserDb {
  async getAll(tenantId: string): Promise<TenantUserWithUserDto[]> {
    const items = await drizzleDb.query.TenantUser.findMany({
      where: eq(TenantUser.tenantId, tenantId),
      with: {
        user: {
          with: {
            roles: {
              with: {
                role: true,
              },
            },
          },
        },
      },
    });
    return items;
  }

  async get(tenantId: string, userId: string): Promise<TenantUserModel | null> {
    const items = await drizzleDb.query.TenantUser.findMany({
      where: and(eq(TenantUser.tenantId, tenantId), eq(TenantUser.userId, userId)),
    });
    return items.length === 0 ? null : items[0];
  }

  async getById(id: string): Promise<TenantUserWithUserDto | null> {
    const items = await drizzleDb.query.TenantUser.findMany({
      where: eq(TenantUser.id, id),
      with: {
        user: {
          with: {
            roles: {
              with: {
                role: true,
              },
            },
          },
        },
      },
    });
    return items.length === 0 ? null : items[0];
  }
  async count(tenantId: string): Promise<number> {
    const results = await drizzleDb.select({ count: count() }).from(TenantUser).where(eq(TenantUser.tenantId, tenantId));
    return results[0].count;
  }
  async countByCreatedAt(tenantId: string, createdAt: { gte: Date; lt: Date }): Promise<number> {
    const result = await drizzleDb
      .select({ count: count() })
      .from(TenantUser)
      .where(and(eq(TenantUser.tenantId, tenantId), gte(TenantUser.createdAt, createdAt.gte), lt(TenantUser.createdAt, createdAt.lt)));
    return result[0].count;
  }
  async create(data: { tenantId: string; userId: string }): Promise<string> {
    const id = createId();
    await drizzleDb.insert(TenantUser).values({
      id,
      tenantId: data.tenantId,
      userId: data.userId,
      createdAt: new Date(),
    });
    return id;
  }

  async del(id: string): Promise<void> {
    await drizzleDb.delete(TenantUser).where(eq(TenantUser.id, id)).execute();
  }
}

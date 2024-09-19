import { and, eq, isNull, inArray, count } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { UserRole, Role, RolePermission, Permission } from "@/db/config/drizzle/schema";
import { IUserRoleDb } from "../../interfaces/permissions/IUserRoleDb";
import { UserRoleModel, UserRoleWithDetailsDto } from "../../models";
import { createId } from "@paralleldrive/cuid2";

export class UserRoleDbDrizzle implements IUserRoleDb {
  async get(params: { userId: string; roleId: string; tenantId: string | null }): Promise<UserRoleModel | null> {
    const conditions = [eq(UserRole.userId, params.userId), eq(UserRole.roleId, params.roleId)];

    if (params.tenantId === null) {
      conditions.push(isNull(UserRole.tenantId));
    } else {
      conditions.push(eq(UserRole.tenantId, params.tenantId));
    }

    const result = await drizzleDb
      .select()
      .from(UserRole)
      .where(and(...conditions))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async getInTenant(userId: string, tenantId: string, roleName: string): Promise<UserRoleModel | null> {
    const result = await drizzleDb
      .select()
      .from(UserRole)
      .innerJoin(Role, eq(UserRole.roleId, Role.id))
      .where(and(eq(UserRole.userId, userId), eq(UserRole.tenantId, tenantId), eq(Role.name, roleName)))
      .limit(1);
    return result.length > 0 ? result[0].UserRole : null;
  }

  async getInAdmin(userId: string, roleName: string): Promise<UserRoleModel | null> {
    const result = await drizzleDb
      .select()
      .from(UserRole)
      .innerJoin(Role, eq(UserRole.roleId, Role.id))
      .where(and(eq(UserRole.userId, userId), isNull(UserRole.tenantId), eq(Role.name, roleName)))
      .limit(1);
    return result.length > 0 ? result[0].UserRole : null;
  }

  async getPermissionsByUser(userId: string, tenantId: string | null): Promise<UserRoleWithDetailsDto[]> {
    const conditions = [eq(UserRole.userId, userId)];
    if (tenantId === null) {
      conditions.push(isNull(UserRole.tenantId));
    } else {
      conditions.push(eq(UserRole.tenantId, tenantId));
    }

    return await drizzleDb.query.UserRole.findMany({
      where: and(...conditions),
      with: {
        role: {
          with: {
            permissions: {
              with: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async countPermissionByUser(userId: string, tenantId: string | null, permissionName: string): Promise<number> {
    const subquery = drizzleDb
      .select({ roleId: UserRole.roleId })
      .from(UserRole)
      .where(and(eq(UserRole.userId, userId), tenantId === null ? isNull(UserRole.tenantId) : eq(UserRole.tenantId, tenantId)));

    const result = await drizzleDb
      .select({ count: count() })
      .from(Permission)
      .innerJoin(RolePermission, eq(Permission.id, RolePermission.permissionId))
      .where(and(eq(Permission.name, permissionName), inArray(RolePermission.roleId, subquery)));

    return result[0].count;
  }

  async create(data: { userId: string; roleId: string; tenantId: string | null }): Promise<string> {
    const id = createId();
    await drizzleDb.insert(UserRole).values({
      id,
      createdAt: new Date(),
      userId: data.userId,
      roleId: data.roleId,
      tenantId: data.tenantId,
    });
    return id;
  }

  async createMany(userId: string, roles: { id: string; tenantId: string | null }[]): Promise<void> {
    await drizzleDb.insert(UserRole).values(
      roles.map((role) => ({
        id: createId(),
        createdAt: new Date(),
        userId,
        roleId: role.id,
        tenantId: role.tenantId,
      }))
    );
  }

  async del(userId: string, roleId: string): Promise<void> {
    await drizzleDb.delete(UserRole).where(and(eq(UserRole.userId, userId), eq(UserRole.roleId, roleId)));
  }

  async deleteAllByUser(userId: string, type: string): Promise<void> {
    const subquery = drizzleDb.select({ id: Role.id }).from(Role).where(eq(Role.type, type));

    await drizzleDb.delete(UserRole).where(and(eq(UserRole.userId, userId), inArray(UserRole.roleId, subquery)));
  }
}

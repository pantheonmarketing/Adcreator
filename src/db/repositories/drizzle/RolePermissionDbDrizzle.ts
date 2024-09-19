import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { RolePermission, Permission } from "@/db/config/drizzle/schema";
import { IRolePermissionDb } from "@/db/interfaces/permissions/IRolePermissionDb";
import { RolePermissionWithPermissionDto } from "@/db/models";

export class RolePermissionDbDrizzle implements IRolePermissionDb {
  async getAll(): Promise<RolePermissionWithPermissionDto[]> {
    return await drizzleDb.query.RolePermission.findMany({
      with: {
        permission: true,
      },
    });
  }

  async get(roleId: string, permissionId: string): Promise<RolePermissionWithPermissionDto | null> {
    const results = await drizzleDb.query.RolePermission.findMany({
      where: and(eq(RolePermission.roleId, roleId), eq(RolePermission.permissionId, permissionId)),
      with: {
        permission: true,
      },
      limit: 1,
    });

    return results.length > 0 ? results[0] : null;
  }

  async create(data: { roleId: string; permissionId: string }): Promise<string> {
    const id = createId();
    await drizzleDb.insert(RolePermission).values({
      id,
      roleId: data.roleId,
      permissionId: data.permissionId,
    });
    return id;
  }

  async deleteByRoleId(roleId: string): Promise<void> {
    await drizzleDb.delete(RolePermission).where(eq(RolePermission.roleId, roleId));
  }

  async deleteByPermissionId(permissionId: string): Promise<void> {
    await drizzleDb.delete(RolePermission).where(eq(RolePermission.permissionId, permissionId));
  }
}

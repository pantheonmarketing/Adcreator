import { prisma } from "@/db/config/prisma/database";
import { IRolePermissionDb } from "@/db/interfaces/permissions/IRolePermissionDb";
import { RolePermissionWithPermissionDto } from "@/db/models";

export class RolePermissionDbPrisma implements IRolePermissionDb {
  async getAll(): Promise<RolePermissionWithPermissionDto[]> {
    return await prisma.rolePermission.findMany({
      include: {
        permission: true,
      },
    });
  }
  async get(roleId: string, permissionId: string): Promise<RolePermissionWithPermissionDto | null> {
    return await prisma.rolePermission
      .findFirstOrThrow({
        where: {
          roleId,
          permissionId,
        },
        include: {
          permission: true,
        },
      })
      .catch(() => null);
  }
  async create(data: { roleId: string; permissionId: string }): Promise<string> {
    const item = await prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
      },
    });
    return item.id;
  }
  async deleteByRoleId(roleId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });
  }
  async deleteByPermissionId(permissionId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        permissionId,
      },
    });
  }
}

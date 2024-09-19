import { prisma } from "@/db/config/prisma/database";
import { IUserRoleDb } from "../../interfaces/permissions/IUserRoleDb";
import { UserRoleModel, UserRoleWithDetailsDto } from "../../models";

export class UserRoleDbPrisma implements IUserRoleDb {
  async get(params: { userId: string; roleId: string; tenantId: string | null }): Promise<UserRoleModel | null> {
    return await prisma.userRole
      .findFirstOrThrow({
        where: {
          userId: params.userId,
          roleId: params.roleId,
          tenantId: params.tenantId,
        },
      })
      .catch(() => null);
  }

  async getInTenant(userId: string, tenantId: string, roleName: string): Promise<UserRoleModel | null> {
    return await prisma.userRole.findFirst({
      where: {
        userId,
        role: {
          name: roleName,
        },
        tenantId,
      },
    });
  }

  async getInAdmin(userId: string, roleName: string): Promise<UserRoleModel | null> {
    return prisma.userRole.findFirst({
      where: {
        userId,
        role: {
          name: roleName,
        },
        tenantId: null,
      },
    });
  }

  async getPermissionsByUser(userId: string, tenantId: string | null): Promise<UserRoleWithDetailsDto[]> {
    return await prisma.userRole.findMany({
      where: { userId, tenantId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: { select: { name: true } } },
            },
          },
        },
      },
    });
  }

  async countPermissionByUser(userId: string, tenantId: string | null, permissionName: string): Promise<number> {
    const normal = await prisma.permission.count({
      where: {
        name: permissionName,
        inRoles: { some: { role: { users: { some: { userId, tenantId } } } } },
      },
    });
    if (normal > 0) {
      return normal;
    }
    return 0;
  }

  async create(data: { userId: string; roleId: string; tenantId: string | null }): Promise<string> {
    const item = await prisma.userRole.create({
      data: {
        userId: data.userId,
        roleId: data.roleId,
        tenantId: data.tenantId,
      },
    });
    return item.id;
  }

  async createMany(userId: string, roles: { id: string; tenantId: string | null }[]): Promise<void> {
    await prisma.userRole.createMany({
      data: roles.map((role) => ({
        userId,
        roleId: role.id,
        tenantId: role.tenantId,
      })),
    });
  }

  async del(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }

  async deleteAllByUser(userId: string, type: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: {
        userId,
        role: {
          type,
        },
      },
    });
  }
}

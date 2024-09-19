import { Prisma } from "@prisma/client";
import { prisma } from "@/db/config/prisma/database";
import { IRoleDb } from "@/db/interfaces/permissions/IRoleDb";
import { RoleWithPermissionsDto, RoleModel, RoleWithPermissionsAndUsersDto } from "@/db/models";

export class RoleDbPrisma implements IRoleDb {
  async getAll(type?: "admin" | "app"): Promise<RoleWithPermissionsDto[]> {
    let where = {};
    if (type !== undefined) {
      where = {
        type,
      };
    }

    return await prisma.role.findMany({
      where,
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { name: "asc" } },
        },
      },
      orderBy: [
        {
          type: "asc",
        },
        {
          order: "asc",
        },
      ],
    });
  }

  async getAllNames(): Promise<{ id: string; name: string }[]> {
    return await prisma.role.findMany({
      select: { id: true, name: true },
      orderBy: [{ type: "asc" }, { order: "asc" }],
    });
  }

  async getAllWithoutPermissions(type?: "admin" | "app"): Promise<RoleModel[]> {
    let where = {};
    if (type !== undefined) {
      where = {
        type,
      };
    }

    return prisma.role.findMany({
      where,
      orderBy: [
        {
          type: "asc",
        },
        {
          order: "asc",
        },
      ],
    });
  }

  async getAllWithUsers(filters?: { type?: "admin" | "app"; permissionId?: string | null }): Promise<RoleWithPermissionsAndUsersDto[]> {
    let where: Prisma.RoleWhereInput = {};
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.permissionId) {
      where = {
        OR: [where, { permissions: { some: { permissionId: filters.permissionId } } }],
      };
    }
    return await prisma.role.findMany({
      where,
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { name: "asc" } },
        },
        users: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, admin: true, defaultTenantId: true, locale: true, avatar: true },
            },
          },
        },
      },
      orderBy: [
        {
          type: "asc",
        },
        {
          order: "asc",
        },
      ],
    });
  }

  async getAllInIds(ids: string[]): Promise<RoleWithPermissionsAndUsersDto[]> {
    return await prisma.role.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { name: "asc" } },
        },
        users: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, admin: true, defaultTenantId: true, locale: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async get(id: string): Promise<RoleWithPermissionsDto | null> {
    return await prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { name: "asc" } },
        },
      },
    });
  }

  async getByName(name: string): Promise<RoleWithPermissionsDto | null> {
    return await prisma.role.findUnique({
      where: {
        name,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
          orderBy: { permission: { name: "asc" } },
        },
      },
    });
  }

  async getMaxOrder(type?: "admin" | "app"): Promise<number> {
    let where = {};
    if (type !== undefined) {
      where = {
        type,
      };
    }
    return (
      (
        await prisma.role.aggregate({
          where,
          _max: {
            order: true,
          },
        })
      )._max.order ?? 0
    );
  }

  async create(data: {
    order: number;
    name: string;
    description: string;
    type: "admin" | "app";
    assignToNewUsers: boolean;
    isDefault: boolean;
  }): Promise<string> {
    const item = await prisma.role.create({
      data,
    });
    return item.id;
  }

  async update(id: string, data: { name: string; description: string; type: "admin" | "app"; assignToNewUsers: boolean }): Promise<void> {
    await prisma.role.update({
      where: { id },
      data,
    });
  }

  async del(id: string): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }
}

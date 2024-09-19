import { Prisma } from "@prisma/client";
import { prisma } from "@/db/config/prisma/database";
import { IPermissionDb } from "@/db/interfaces/permissions/IPermissionDb";
import { PermissionWithRolesDto, PermissionDto } from "@/db/models";

export class PermissionDbPrisma implements IPermissionDb {
  async getAll(filters?: { type?: string; roleId?: string | null }): Promise<PermissionWithRolesDto[]> {
    let where: Prisma.PermissionWhereInput = {};
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.roleId) {
      where.inRoles = { some: { roleId: filters.roleId } };
    }

    return await prisma.permission.findMany({
      where,
      include: {
        inRoles: {
          include: { role: true },
        },
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  async getAllIdsAndNames(): Promise<PermissionDto[]> {
    return await prisma.permission.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });
  }

  async get(id: string): Promise<PermissionWithRolesDto | null> {
    return await prisma.permission.findUnique({
      where: {
        id,
      },
      include: {
        inRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async getByName(name: string): Promise<PermissionDto | null> {
    return await prisma.permission.findUnique({
      where: {
        name,
      },
      select: { id: true, name: true, description: true },
    });
  }

  async getMaxOrder(type: "admin" | "app"): Promise<number> {
    let where = {};
    if (type !== undefined) {
      where = {
        type,
      };
    }
    return (
      (
        await prisma.permission.aggregate({
          where,
          _max: {
            order: true,
          },
        })
      )._max.order ?? 0
    );
  }

  async create(data: { order: number; name: string; description: string; type: string; isDefault: boolean }): Promise<string> {
    const item = await prisma.permission.create({
      data,
    });
    return item.id;
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      type?: string;
      order?: number;
    }
  ): Promise<void> {
    await prisma.permission.update({
      where: { id },
      data,
    });
  }

  async del(id: string): Promise<void> {
    await prisma.permission.delete({
      where: { id },
    });
  }
}

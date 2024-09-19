import { Prisma } from "@prisma/client";
import { prisma } from "@/db/config/prisma/database";
import { IUserDb } from "@/db/interfaces/accounts/IUserDb";
import { UserModel, UserDto, UserWithDetailsDto } from "@/db/models";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";

export class UserDbPrisma implements IUserDb {
  async getAllWhereTenant(tenantId: string): Promise<UserWithDetailsDto[]> {
    return prisma.user.findMany({
      where: {
        tenants: {
          some: {
            tenantId,
          },
        },
      },
      include: {
        tenants: {
          include: {
            tenant: true,
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
  async getAllWithPagination({
    filters,
    pagination,
  }: {
    filters: { email?: string; firstName?: string; lastName?: string; tenantId?: string | null; admin?: boolean };
    pagination: { page: number; pageSize: number; sortedBy?: SortedByDto[] };
  }): Promise<{ items: UserWithDetailsDto[]; pagination: PaginationDto }> {
    let where: Prisma.UserWhereInput = {};
    if (filters?.email) {
      where.email = { contains: filters.email };
    }
    if (filters?.firstName) {
      where.firstName = { contains: filters.firstName };
    }
    if (filters?.lastName) {
      where.lastName = { contains: filters.lastName };
    }
    if (filters?.tenantId) {
      where = {
        OR: [where, { tenants: { some: { tenantId: filters.tenantId } } }],
      };
    }
    if (filters?.admin !== undefined) {
      where.admin = filters.admin;
    }

    let orderBy: Prisma.UserOrderByWithRelationInput[] = [{ createdAt: "desc" }];
    if (pagination?.sortedBy?.length) {
      pagination.sortedBy = pagination.sortedBy.filter((s) => ["email", "firstName", "lastName", "createdAt"].includes(s.name));
      orderBy = pagination.sortedBy.map((s) => {
        return { [s.name]: s.direction };
      });
    }
    const items = await prisma.user.findMany({
      skip: pagination ? pagination?.pageSize * (pagination?.page - 1) : undefined,
      take: pagination ? pagination?.pageSize : undefined,
      where,
      include: {
        tenants: {
          include: {
            tenant: true,
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy,
    });
    const totalItems = await prisma.user.count({
      where,
    });
    return {
      items,
      pagination: {
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
        totalItems,
        totalPages: Math.ceil(totalItems / (pagination?.pageSize ?? DEFAULT_PAGE_SIZE)),
      },
    };
  }
  async getAll(): Promise<UserWithDetailsDto[]> {
    return await prisma.user.findMany({
      include: {
        tenants: { include: { tenant: true } },
        roles: { include: { role: true } },
      },
    });
  }
  async get(id: string): Promise<UserDto | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        admin: true,
        defaultTenantId: true,
        locale: true,
      },
    });
  }
  async getByEmail(email: string): Promise<UserDto | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        admin: true,
        defaultTenantId: true,
        locale: true,
      },
    });
  }
  async getByEmailWithDetails(email: string): Promise<UserWithDetailsDto | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        tenants: { include: { tenant: true } },
        roles: { include: { role: true } },
      },
    });
  }
  async getPasswordHash(id: string): Promise<string | null> {
    const item = await prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });

    return item?.passwordHash ?? null;
  }
  async getVerifyToken(id: string): Promise<string | null> {
    const item = await prisma.user.findUnique({
      where: { id },
      select: { verifyToken: true },
    });

    return item?.verifyToken ?? null;
  }
  async count(): Promise<number> {
    return prisma.user.count();
  }
  async create(data: UserModel): Promise<string> {
    const item = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        phone: data.phone,
        active: data.active,
        locale: data.locale,
        defaultTenantId: data.defaultTenantId,
        admin: data.admin,
      },
    });
    return item.id;
  }
  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatar?: string | null;
      locale?: string | null;
      verifyToken?: string | null;
      passwordHash?: string;
      defaultTenantId?: string | null;
      admin?: boolean;
    }
  ): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        locale: data.locale,
        verifyToken: data.verifyToken,
        passwordHash: data.passwordHash,
        defaultTenantId: data.defaultTenantId,
        admin: data.admin,
      },
    });
  }
  async del(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
  async deleteAll(): Promise<void> {
    await prisma.user.deleteMany({});
  }
}

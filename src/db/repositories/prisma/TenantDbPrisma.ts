import { Prisma } from "@prisma/client";
import { prisma } from "@/db/config/prisma/database";
import { ITenantDb } from "@/db/interfaces/accounts/ITenantDb";
import { TenantWithDetailsDto, TenantDto } from "@/db/models";
import { PaginationRequestDto, PaginationDto } from "@/lib/dtos/PaginationDto";

export class TenantDbPrisma implements ITenantDb {
  async getAll(): Promise<TenantWithDetailsDto[]> {
    return await prisma.tenant.findMany({
      include: {
        ...includeTenantWithDetails,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async getAllIdsAndNames(): Promise<{ id: string; name: string; slug: string }[]> {
    return await prisma.tenant.findMany({
      select: { id: true, name: true, slug: true },
    });
  }
  async getAllWithPagination({
    filters,
    pagination,
  }: {
    filters?: { name?: string; slug?: string; active?: boolean };
    pagination?: PaginationRequestDto;
  }): Promise<{ items: TenantWithDetailsDto[]; pagination: PaginationDto }> {
    let where: Prisma.TenantWhereInput = {};
    if (filters?.name) {
      where = { AND: [where, { name: { contains: filters.name, mode: "insensitive" } }] };
    }
    if (filters?.slug) {
      where = { AND: [where, { slug: { contains: filters.slug } }] };
    }
    if (filters?.active !== undefined) {
      where = { AND: [where, { active: filters.active }] };
    }
    const items = await prisma.tenant.findMany({
      skip: pagination ? pagination?.pageSize * (pagination?.page - 1) : undefined,
      take: pagination ? pagination?.pageSize : undefined,
      where,
      include: {
        users: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, admin: true, defaultTenantId: true, locale: true, avatar: true },
            },
          },
        },
        subscription: {
          include: {
            products: {
              include: {
                subscriptionProduct: { include: { features: true } },
                prices: {
                  include: {
                    subscriptionPrice: true,
                    subscriptionUsageBasedPrice: true,
                  },
                },
              },
            },
          },
        },
        _count: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalItems = await prisma.tenant.count({
      where,
    });
    return {
      items,
      pagination: {
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 10,
        totalItems,
        totalPages: Math.ceil(totalItems / (pagination?.pageSize ?? 10)),
      },
    };
  }
  async getByUser(userId: string): Promise<TenantDto[]> {
    return await prisma.tenant.findMany({
      where: { users: { some: { userId } } },
      select: { id: true, name: true, slug: true, icon: true, active: true },
      orderBy: { name: "asc" },
    });
  }
  async get(id: string): Promise<TenantWithDetailsDto | null> {
    return await prisma.tenant.findUnique({
      where: {
        id,
      },
      include: {
        ...includeTenantWithDetails,
      },
    });
  }
  async getSimple(id: string): Promise<TenantDto | null> {
    return await prisma.tenant.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, icon: true, active: true },
    });
  }
  async getByIdOrSlug(id: string): Promise<TenantDto | null> {
    return await prisma.tenant
      .findFirstOrThrow({
        where: { OR: [{ slug: id }, { id }] },
        select: { id: true, name: true, slug: true, icon: true, active: true },
      })
      .catch(() => null);
  }
  async getIdByIdOrSlug(id: string | undefined): Promise<string | null> {
    const item = await prisma.tenant
      .findFirstOrThrow({
        where: { OR: [{ slug: id }, { id }] },
        select: { id: true },
      })
      .catch(() => null);
    return item?.id || null;
  }
  async countCreatedSince(since: Date | undefined): Promise<number> {
    return await prisma.tenant.count({
      where: { createdAt: { gte: since } },
    });
  }
  async countBySlug(slug: string): Promise<number> {
    return await prisma.tenant.count({
      where: { slug },
    });
  }
  async count(): Promise<number> {
    return await prisma.tenant.count();
  }
  async create({ slug, name, icon, active }: { slug: string; name: string; icon: string | null; active: boolean }): Promise<string> {
    const item = await prisma.tenant.create({
      data: {
        name,
        slug,
        icon,
        active,
      },
    });
    return item.id;
  }
  async update(id: string, data: { name?: string; icon?: string; slug?: string }): Promise<void> {
    await prisma.tenant.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        slug: data.slug,
      },
    });
  }
  async del(id: string): Promise<void> {
    await prisma.tenant.delete({
      where: { id },
    });
  }
  async deleteAll(): Promise<void> {
    await prisma.tenant.deleteMany();
  }
}

const includeTenantWithDetails = {
  users: {
    include: {
      user: {
        select: { id: true, email: true, firstName: true, lastName: true, admin: true, defaultTenantId: true, locale: true, avatar: true },
      },
    },
  },
  subscription: {
    include: {
      products: {
        include: {
          subscriptionProduct: { include: { features: true } },
          prices: {
            include: {
              subscriptionPrice: true,
              subscriptionUsageBasedPrice: true,
            },
          },
        },
      },
    },
  },
};

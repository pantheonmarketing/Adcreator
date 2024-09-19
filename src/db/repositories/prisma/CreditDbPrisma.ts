import { Prisma } from "@prisma/client";
import { prisma } from "@/db/config/prisma/database";
import { ICreditDb } from "@/db/interfaces/subscriptions/ICreditDb";
import { CreditWithDetailsDto } from "@/db/models";
import { PaginationDto } from "@/lib/dtos/PaginationDto";

export class CreditDbPrisma implements ICreditDb {
  async getAllWithPagination({
    filters,
    pagination,
  }: {
    filters: { tenantId: string | null; q?: string | null; userId?: string | null; type?: string | null };
    pagination: { pageSize: number; page: number };
  }): Promise<{
    items: CreditWithDetailsDto[];
    pagination: PaginationDto;
  }> {
    const AND_filters: Prisma.CreditWhereInput[] = [];
    const OR_filters: Prisma.CreditWhereInput[] = [];
    if (filters.q) {
      OR_filters.push({ type: { contains: filters.q, mode: "insensitive" } }, { objectId: { contains: filters.q, mode: "insensitive" } });
    }
    if (filters.userId) {
      AND_filters.push({ userId: filters.userId });
    }
    if (filters.type) {
      AND_filters.push({ type: filters.type });
    }

    const whereFilters: Prisma.CreditWhereInput = {};
    if (OR_filters.length > 0) {
      whereFilters.OR = OR_filters;
    }
    if (AND_filters.length > 0) {
      whereFilters.AND = AND_filters;
    }

    if (filters.tenantId) {
      whereFilters.tenantId = filters.tenantId;
    }
    const items = await prisma.credit.findMany({
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      where: whereFilters,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tenant: { select: { name: true } },
        user: { select: { email: true } },
      },
    });
    const totalItems = await prisma.credit.count({
      where: whereFilters,
    });
    return {
      items,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pagination.pageSize),
      },
    };
  }

  async create(data: { tenantId: string; userId: string | null; type: string; objectId: string | null; amount: number }): Promise<string> {
    const item = await prisma.credit.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        type: data.type,
        objectId: data.objectId,
        amount: data.amount,
      },
    });
    return item.id;
  }
  async sumAmount(filters: { tenantId: string; createdAt?: { gte: Date; lt: Date } }): Promise<number> {
    const whereClause: Prisma.CreditWhereInput = {
      tenantId: filters.tenantId,
    };

    if (filters.createdAt) {
      whereClause.createdAt = {
        gte: filters.createdAt.gte,
        lt: filters.createdAt.lt,
      };
    }

    const result = await prisma.credit.aggregate({
      where: whereClause,
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ?? 0;
  }
}

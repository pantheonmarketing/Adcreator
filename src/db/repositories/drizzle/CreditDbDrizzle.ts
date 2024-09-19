import { createId } from "@paralleldrive/cuid2";
import { and, count, desc, eq, gte, like, lt, or, SQL, sum } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { Credit } from "@/db/config/drizzle/schema";
import { ICreditDb } from "@/db/interfaces/subscriptions/ICreditDb";
import { CreditWithDetailsDto } from "@/db/models";
import { PaginationDto } from "@/lib/dtos/PaginationDto";

export class CreditDbDrizzle implements ICreditDb {
  async getAllWithPagination({
    filters,
    pagination,
  }: {
    filters: { tenantId: string | null; q?: string | null; userId?: string | null; type?: string | null };
    pagination: { pageSize: number; page: number };
  }): Promise<{ items: CreditWithDetailsDto[]; pagination: PaginationDto }> {
    let whereConditions: SQL[] = [];

    if (filters.tenantId) {
      whereConditions.push(eq(Credit.tenantId, filters.tenantId));
    }

    if (filters.userId) {
      whereConditions.push(eq(Credit.userId, filters.userId));
    }

    if (filters.type) {
      whereConditions.push(eq(Credit.type, filters.type));
    }

    if (filters.q) {
      const q = or(like(Credit.type, `%${filters.q}%`), like(Credit.objectId, `%${filters.q}%`));
      if (q) {
        whereConditions.push(q);
      }
    }

    const items: CreditWithDetailsDto[] = await drizzleDb.query.Credit.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        tenant: {
          columns: { name: true },
        },
        user: {
          columns: { email: true },
        },
      },
      limit: pagination.pageSize,
      offset: pagination.pageSize * (pagination.page - 1),
      orderBy: [desc(Credit.createdAt)],
    });

    const totalItems = (
      await drizzleDb
        .select({ count: count() })
        .from(Credit)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    )[0].count;

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
    const id = createId();
    await drizzleDb.insert(Credit).values({
      id,
      createdAt: new Date(),
      tenantId: data.tenantId,
      userId: data.userId,
      type: data.type,
      objectId: data.objectId,
      amount: data.amount,
    });
    return id;
  }
  async sumAmount(filters: { tenantId: string; createdAt?: { gte: Date; lt: Date } }): Promise<number> {
    let conditions = [eq(Credit.tenantId, filters.tenantId)];

    if (filters.createdAt) {
      conditions.push(gte(Credit.createdAt, filters.createdAt.gte));
      conditions.push(lt(Credit.createdAt, filters.createdAt.lt));
    }

    const result = await drizzleDb
      .select({ sum: sum(Credit.amount).as("sum") })
      .from(Credit)
      .where(and(...conditions));

    // Explicitly cast the result to a number
    const sumValue = result[0]?.sum;
    return sumValue ? Number(sumValue) : 0;
  }
}

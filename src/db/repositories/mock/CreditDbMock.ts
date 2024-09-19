import { createId } from "@paralleldrive/cuid2";
import { mockDb } from "@/db/config/mock/data/mockDb";
import { IUserDb } from "@/db/interfaces/accounts/IUserDb";
import { ICreditDb } from "@/db/interfaces/subscriptions/ICreditDb";
import { UserModel, UserDto, UserWithDetailsDto, CreditWithDetailsDto, CreditModel } from "@/db/models";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";

export class CreditDbMock implements ICreditDb {
  withDetails(item: CreditModel): CreditWithDetailsDto {
    return {
      ...item,
      tenant: { name: "Tenant" },
      user: item.userId ? { email: "john@doe.com" } : null,
    };
  }
  getAllWithPagination({
    filters,
    pagination,
  }: {
    filters: { tenantId: string | null; q?: string | null; userId?: string | null; type?: string | null };
    pagination: { pageSize: number; page: number };
  }): Promise<{ items: CreditWithDetailsDto[]; pagination: PaginationDto }> {
    return Promise.resolve({
      items: mockDb.credit.map((c) => this.withDetails(c)),
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: mockDb.credit.length,
        totalPages: Math.ceil(mockDb.credit.length / 10),
      },
    });
  }
  create(data: { tenantId: string; userId: string | null; type: string; objectId: string | null; amount: number }): Promise<string> {
    const item: CreditModel = { ...data, id: createId(), createdAt: new Date() };
    mockDb.credit.push(item);
    return Promise.resolve(item.id);
  }
  sumAmount(filters: { tenantId: string; createdAt?: { gte: Date; lt: Date } }): Promise<number> {
    return Promise.resolve(mockDb.credit.filter((c) => c.tenantId === filters.tenantId).reduce((acc, c) => acc + c.amount, 0));
  }
}

import { PaginationDto } from "@/lib/dtos/PaginationDto";
import { CreditWithDetailsDto } from "../../models";

export interface ICreditDb {
  getAllWithPagination({
    filters,
    pagination,
  }: {
    filters: { tenantId: string | null; q?: string | null; userId?: string | null; type?: string | null };
    pagination: { pageSize: number; page: number };
  }): Promise<{ items: CreditWithDetailsDto[]; pagination: PaginationDto }>;
  create(data: { tenantId: string; userId: string | null; type: string; objectId: string | null; amount: number }): Promise<string>;
  sumAmount(filters: { tenantId: string; createdAt?: { gte: Date; lt: Date } }): Promise<number>;
}

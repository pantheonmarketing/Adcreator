import { UserModel, UserDto, UserWithDetailsDto } from "../../models";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";

export interface IUserDb {
  getAllWhereTenant(tenantId: string): Promise<UserWithDetailsDto[]>;
  getAllWithPagination(params: {
    filters: { email?: string; firstName?: string; lastName?: string; tenantId?: string | null; admin?: boolean };
    pagination: { page: number; pageSize: number; sortedBy?: SortedByDto[] };
  }): Promise<{ items: UserWithDetailsDto[]; pagination: PaginationDto }>;
  getAll(): Promise<UserWithDetailsDto[]>;
  get(userId: string): Promise<UserDto | null>;
  getByEmail(email: string): Promise<UserDto | null>;
  getByEmailWithDetails(email: string): Promise<UserWithDetailsDto | null>;
  getPasswordHash(id: string): Promise<string | null>;
  getVerifyToken(id: string): Promise<string | null>;
  count(): Promise<number>;
  create(data: Omit<UserModel, "id" | "createdAt" | "updatedAt">): Promise<string>;
  update(
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
  ): Promise<void>;
  del(id: string): Promise<void>;
  deleteAll(): Promise<void>;
}

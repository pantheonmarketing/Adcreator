import { createId } from "@paralleldrive/cuid2";
import { mockDb } from "@/db/config/mock/data/mockDb";
import { IUserDb } from "@/db/interfaces/accounts/IUserDb";
import { UserModel, UserDto, UserWithDetailsDto } from "@/db/models";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";
import bcrypt from "bcryptjs";

export class UserDbMock implements IUserDb {
  withDetails(item: UserModel): UserWithDetailsDto {
    return {
      ...item,
      tenants: [],
      roles: [],
    };
  }
  getAllWhereTenant(tenantId: string): Promise<UserWithDetailsDto[]> {
    return Promise.resolve(mockDb.user.map((u) => this.withDetails(u)));
  }
  getAllWithPagination({
    filters,
    pagination,
  }: {
    filters?: { email?: string; firstName?: string; lastName?: string; tenantId?: string | null; admin?: boolean | undefined };
    pagination?: { page: number; pageSize: number; sortedBy?: SortedByDto[] | undefined };
  }): Promise<{ items: UserWithDetailsDto[]; pagination: PaginationDto }> {
    return Promise.resolve({
      items: mockDb.user.map((u) => this.withDetails(u)),
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: mockDb.user.length,
        totalPages: Math.ceil(mockDb.user.length / 10),
      },
    });
  }
  getAll(): Promise<UserWithDetailsDto[]> {
    return Promise.resolve(mockDb.user.map((u) => this.withDetails(u)));
  }
  get(userId: string): Promise<UserDto | null> {
    return Promise.resolve(mockDb.user.find((u) => u.id === userId) || null);
  }
  getByEmail(email: string): Promise<UserDto | null> {
    const item = mockDb.user.find((u) => u.email === email);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getByEmailWithDetails(email: string): Promise<UserWithDetailsDto | null> {
    const item = mockDb.user.find((u) => u.email === email);
    return item ? Promise.resolve(this.withDetails(item)) : Promise.resolve(null);
  }
  async getPasswordHash(id: string): Promise<string | null> {
    const item = mockDb.user.find((u) => u.id === id);
    return item ? Promise.resolve(await bcrypt.hash(item.passwordHash, 10)) : Promise.resolve(null);
  }
  getVerifyToken(id: string): Promise<string | null> {
    const item = mockDb.user.find((u) => u.id === id);
    return item ? Promise.resolve(item.verifyToken) : Promise.resolve(null);
  }
  count(): Promise<number> {
    return Promise.resolve(mockDb.user.length);
  }
  create(data: UserModel): Promise<string> {
    const item: UserModel = { ...data, id: createId(), createdAt: new Date(), updatedAt: new Date(), verifyToken: null };
    mockDb.user.push(item);
    return Promise.resolve(item.id);
  }
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
  ): Promise<void> {
    mockDb.user = mockDb.user.map((u) => (u.id === id ? { ...u, ...data } : u));
    return Promise.resolve();
  }
  del(id: string): Promise<void> {
    mockDb.user = mockDb.user.filter((u) => u.id !== id);
    return Promise.resolve();
  }
  deleteAll(): Promise<void> {
    mockDb.user = [];
    return Promise.resolve();
  }
}

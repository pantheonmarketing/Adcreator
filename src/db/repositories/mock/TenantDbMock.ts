import { ITenantDb } from "../../interfaces/accounts/ITenantDb";
import { TenantDto, TenantModel, TenantWithDetailsDto } from "../../models";
import { PaginationDto, PaginationRequestDto } from "@/lib/dtos/PaginationDto";
import { mockDb } from "../../config/mock/data/mockDb";

export class TenantDbMock implements ITenantDb {
  withDetails(item: TenantModel): TenantWithDetailsDto {
    return {
      ...item,
      users: [],
      subscription: null,
    };
  }
  getAll(): Promise<TenantWithDetailsDto[]> {
    return Promise.resolve(mockDb.tenant.map((t) => this.withDetails(t)));
  }
  getAllIdsAndNames(): Promise<{ id: string; name: string; slug: string }[]> {
    return Promise.resolve(mockDb.tenant.map((t) => ({ id: t.id, name: t.name, slug: t.slug })));
  }
  getAllWithPagination(params: {
    filters?: { name?: string; slug?: string; active?: boolean };
    pagination: PaginationRequestDto;
  }): Promise<{ items: TenantWithDetailsDto[]; pagination: PaginationDto }> {
    return Promise.resolve({
      items: mockDb.tenant.map((t) => this.withDetails(t)),
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: mockDb.tenant.length,
        totalPages: Math.ceil(mockDb.tenant.length / 10),
      },
    });
  }
  getByUser(userId: string): Promise<TenantDto[]> {
    const tenantUsers = mockDb.tenantUser.filter((tu) => tu.userId === userId);
    const tenants = tenantUsers.map((tu) => mockDb.tenant.find((t) => t.id === tu.tenantId)).filter((t) => t) as TenantDto[];
    return Promise.resolve(tenants);
  }
  get(id: string): Promise<TenantWithDetailsDto | null> {
    const item = mockDb.tenant.find((t) => t.id === id);
    return item ? Promise.resolve(this.withDetails(item)) : Promise.resolve(null);
  }
  getSimple(id: string): Promise<TenantDto | null> {
    const item = mockDb.tenant.find((t) => t.id === id);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getByIdOrSlug(id: string): Promise<TenantDto | null> {
    const item = mockDb.tenant.find((t) => t.id === id || t.slug === id);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getIdByIdOrSlug(tenant: string | undefined): Promise<string | null> {
    const item = mockDb.tenant.find((t) => t.id === tenant || t.slug === tenant);
    return item ? Promise.resolve(item.id) : Promise.resolve(null);
  }
  countCreatedSince(since: Date | undefined): Promise<number> {
    return Promise.resolve(mockDb.tenant.filter((t) => (since ? t.createdAt >= since : true)).length);
  }
  countBySlug(slug: string): Promise<number> {
    return Promise.resolve(mockDb.tenant.filter((t) => t.slug === slug).length);
  }
  count(): Promise<number> {
    return Promise.resolve(mockDb.tenant.length);
  }
  create(data: { slug: string; name: string; icon: string | null; active: boolean }): Promise<string> {
    mockDb.tenant.push({
      ...data,
      id: "100",
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionId: null,
    });
    return Promise.resolve("100");
  }
  update(id: string, data: { name?: string; icon?: string; slug?: string }): Promise<void> {
    mockDb.tenant = mockDb.tenant.map((item) => {
      return item.id === id ? { ...item, ...data } : item;
    });
    return Promise.resolve();
  }
  del(id: string): Promise<void> {
    mockDb.tenant = mockDb.tenant.filter((t) => t.id !== id);
    return Promise.resolve();
  }
  deleteAll(): Promise<void> {
    mockDb.tenant = [];
    return Promise.resolve();
  }
}

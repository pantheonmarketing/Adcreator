import { ITenantUserDb } from "../../interfaces/accounts/ITenantUserDb";
import { mockDb } from "../../config/mock/data/mockDb";
import { TenantUserWithUserDto, TenantUserModel } from "@/db/models";

export class TenantUserDbMock implements ITenantUserDb {
  withDetails(item: TenantUserModel): TenantUserWithUserDto {
    return {
      ...item,
      user: {
        ...mockDb.user.find((u) => u.id === item.userId)!,
        roles: [],
      },
    };
  }
  getAll(tenantId: string): Promise<TenantUserWithUserDto[]> {
    return Promise.resolve(mockDb.tenantUser.filter((tu) => tu.tenantId === tenantId).map((tu) => this.withDetails(tu)));
  }
  get(tenantId: string, userId: string): Promise<TenantUserModel | null> {
    const item = mockDb.tenantUser.find((tu) => tu.tenantId === tenantId && tu.userId === userId);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getById(id: string): Promise<TenantUserWithUserDto | null> {
    const item = mockDb.tenantUser.find((tu) => tu.id === id);
    return item ? Promise.resolve(this.withDetails(item)) : Promise.resolve(null);
  }
  count(tenantId: string): Promise<number> {
    return Promise.resolve(mockDb.tenantUser.filter((tu) => tu.tenantId === tenantId).length);
  }
  countByCreatedAt(tenantId: string, createdAt: { gte: Date; lt: Date }): Promise<number> {
    return Promise.resolve(mockDb.tenantUser.filter((tu) => tu.tenantId === tenantId && tu.createdAt >= createdAt.gte && tu.createdAt < createdAt.lt).length);
  }
  create(data: { tenantId: string; userId: string }): Promise<string> {
    const item: TenantUserModel = {
      ...data,
      id: "100",
      createdAt: new Date(),
    };
    mockDb.tenantUser.push(item);
    return Promise.resolve(item.id);
  }
  del(id: string): Promise<void> {
    const index = mockDb.tenantUser.findIndex((tu) => tu.id === id);
    if (index !== -1) {
      mockDb.tenantUser.splice(index, 1);
    }
    return Promise.resolve();
  }
}

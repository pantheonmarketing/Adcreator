import { TenantUserModel, TenantUserWithUserDto } from "../../models";

export interface ITenantUserDb {
  getAll(tenantId: string): Promise<TenantUserWithUserDto[]>;
  get(tenantId: string, userId: string): Promise<TenantUserModel | null>;
  getById(id: string): Promise<TenantUserWithUserDto | null>;
  count(tenantId: string): Promise<number>;
  countByCreatedAt(tenantId: string, createdAt: { gte: Date; lt: Date }): Promise<number>;
  create(data: { tenantId: string; userId: string }): Promise<string>;
  del(id: string): Promise<void>;
}

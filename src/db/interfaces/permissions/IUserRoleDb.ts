import { UserRoleModel, UserRoleWithDetailsDto } from "../../models";

export interface IUserRoleDb {
  get(params: { userId: string; roleId: string; tenantId: string | null }): Promise<UserRoleModel | null>;
  getInTenant(userId: string, tenantId: string, roleName: string): Promise<UserRoleModel | null>;
  getInAdmin(userId: string, roleName: string): Promise<UserRoleModel | null>;
  getPermissionsByUser(userId: string, tenantId: string | null): Promise<UserRoleWithDetailsDto[]>;
  countPermissionByUser(userId: string, tenantId: string | null, permissionName: string): Promise<number>;
  create(data: { userId: string; roleId: string; tenantId: string | null }): Promise<string>;
  createMany(userId: string, roles: { id: string; tenantId: string | null }[]): Promise<void>;
  del(userId: string, roleId: string): Promise<void>;
  deleteAllByUser(userId: string, type: string): Promise<void>;
}

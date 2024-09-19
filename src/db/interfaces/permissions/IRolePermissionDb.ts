import { RolePermissionWithPermissionDto } from "../../models";

export interface IRolePermissionDb {
  get(roleId: string, permissionId: string): Promise<RolePermissionWithPermissionDto | null>;
  getAll(): Promise<RolePermissionWithPermissionDto[]>;
  create(data: { roleId: string; permissionId: string }): Promise<string>;
  deleteByRoleId(roleId: string): Promise<void>;
  deleteByPermissionId(permissionId: string): Promise<void>;
}

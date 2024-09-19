import { mockDb } from "@/db/config/mock/data/mockDb";
import { IPermissionDb } from "@/db/interfaces/permissions/IPermissionDb";
import { IRolePermissionDb } from "@/db/interfaces/permissions/IRolePermissionDb";
import { IUserRoleDb } from "@/db/interfaces/permissions/IUserRoleDb";
import {
  PermissionDto,
  PermissionModel,
  PermissionWithRolesDto,
  RolePermissionModel,
  RolePermissionWithPermissionDto,
  UserRoleModel,
  UserRoleWithDetailsDto,
} from "@/db/models";

export class RolePermissionDbMock implements IRolePermissionDb {
  withPermission(item: RolePermissionModel): RolePermissionWithPermissionDto {
    return {
      ...item,
      permission: mockDb.permission[0],
    };
  }

  get(roleId: string, permissionId: string): Promise<RolePermissionWithPermissionDto | null> {
    return Promise.resolve(this.withPermission(mockDb.rolePermission[0]));
  }
  getAll(): Promise<RolePermissionWithPermissionDto[]> {
    return Promise.resolve(mockDb.rolePermission.map((rp) => this.withPermission(rp)));
  }
  create(data: { roleId: string; permissionId: string }): Promise<string> {
    return Promise.resolve("1");
  }
  deleteByRoleId(roleId: string): Promise<void> {
    return Promise.resolve();
  }
  deleteByPermissionId(permissionId: string): Promise<void> {
    return Promise.resolve();
  }
}

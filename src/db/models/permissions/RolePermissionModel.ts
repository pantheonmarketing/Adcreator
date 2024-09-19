import { PermissionModel } from "./PermissionModel";

export type RolePermissionModel = {
  id: string;
  roleId: string;
  permissionId: string;
};

export type RolePermissionWithPermissionDto = RolePermissionModel & {
  permission: PermissionModel;
};

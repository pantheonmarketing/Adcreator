import { PermissionModel, RolePermissionModel, UserDto, UserRoleModel } from "..";

export type RoleModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  type: string;
  assignToNewUsers: boolean;
  isDefault: boolean;
  order: number;
};

export type RoleWithPermissionsDto = RoleModel & {
  permissions: (RolePermissionModel & { permission: PermissionModel })[];
};

export type RoleWithPermissionsAndUsersDto = RoleWithPermissionsDto & {
  users: (UserRoleModel & { user: UserDto })[];
};

import { RoleModel, RolePermissionModel } from "..";

export type PermissionModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  type: string;
  isDefault: boolean;
  order: number;
};

export type PermissionDto = {
  id: string;
  name: string;
  description: string;
};

export type PermissionWithRolesDto = PermissionModel & {
  inRoles: (RolePermissionModel & { role: RoleModel })[];
};

import { RoleModel } from "./RoleModel";

export type UserRoleModel = {
  id: string;
  createdAt: Date;
  userId: string;
  roleId: string;
  tenantId: string | null;
};

export type UserRoleWithDetailsDto = UserRoleModel & {
  role: RoleModel & {
    permissions: {
      permission: { name: string };
    }[];
  };
};

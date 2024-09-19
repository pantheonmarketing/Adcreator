import { RoleModel, UserRoleModel, TenantModel, TenantUserModel } from "..";

export type UserModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phone: string | null;
  defaultTenantId: string | null;
  verifyToken: string | null;
  locale: string | null;
  active: boolean;
  admin: boolean;
};

export type UserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  defaultTenantId: string | null;
  locale: string | null;
  avatar: string | null;
};

export type UserWithRolesDto = UserDto & {
  roles: (UserRoleModel & { role: RoleModel })[];
};

export type UserWithDetailsDto = UserDto & {
  createdAt: Date;
  tenants: (TenantUserModel & { tenant: TenantModel })[];
  roles: (UserRoleModel & { role: RoleModel })[];
};

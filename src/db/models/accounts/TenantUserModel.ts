import { UserWithRolesDto } from "..";

export type TenantUserModel = {
  id: string;
  createdAt: Date;
  tenantId: string;
  userId: string;
};

export type TenantUserWithUserDto = TenantUserModel & {
  user: UserWithRolesDto;
};

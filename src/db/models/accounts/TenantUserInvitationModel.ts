import { TenantModel } from "..";

export type TenantUserInvitationModel = {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  pending: boolean;
  createdUserId: string | null;
  fromUserId: string | null;
};

export type TenantUserInvitationWithTenantDto = TenantUserInvitationModel & {
  tenant: TenantModel;
};

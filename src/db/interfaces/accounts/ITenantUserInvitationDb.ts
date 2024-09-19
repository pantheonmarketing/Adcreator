import { TenantUserInvitationModel, TenantUserInvitationWithTenantDto } from "../../models";

export interface ITenantUserInvitationDb {
  get(id: string): Promise<TenantUserInvitationWithTenantDto | null>;
  getPending(tenantId: string): Promise<TenantUserInvitationModel[]>;
  create(data: Omit<TenantUserInvitationModel, "id" | "createdAt" | "updatedAt">): Promise<string>;
  update(id: string, data: { pending?: boolean }): Promise<void>;
  del(id: string): Promise<void>;
}

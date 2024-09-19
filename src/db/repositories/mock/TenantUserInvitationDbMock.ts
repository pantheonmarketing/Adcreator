import { ITenantUserInvitationDb } from "../../interfaces/accounts/ITenantUserInvitationDb";
import { TenantUserInvitationModel, TenantUserInvitationWithTenantDto, UserRegistrationAttemptModel } from "../../models";
import { mockDb } from "../../config/mock/data/mockDb";

export class TenantUserInvitationDbMock implements ITenantUserInvitationDb {
  withDetails(item: TenantUserInvitationModel): TenantUserInvitationWithTenantDto {
    return {
      ...item,
      tenant: mockDb.tenant.find((t) => t.id === item.tenantId)!,
    };
  }
  get(id: string): Promise<TenantUserInvitationWithTenantDto | null> {
    const item = mockDb.tenantUserInvitation.find((u) => u.id === id);
    return item ? Promise.resolve(this.withDetails(item)) : Promise.resolve(null);
  }
  getPending(tenantId: string): Promise<TenantUserInvitationModel[]> {
    return Promise.resolve(mockDb.tenantUserInvitation.filter((u) => u.tenantId === tenantId && u.pending));
  }
  create(data: Omit<TenantUserInvitationModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item: TenantUserInvitationModel = { ...data, id: "2" };
    mockDb.tenantUserInvitation.push(item);
    return Promise.resolve("2");
  }
  update(id: string, data: { pending?: boolean }): Promise<void> {
    mockDb.tenantUserInvitation = mockDb.tenantUserInvitation.map((item) => {
      return item.id === id ? { ...item, ...data } : item;
    });
    return Promise.resolve();
  }
  del(id: string): Promise<void> {
    mockDb.tenantUserInvitation = mockDb.tenantUserInvitation.filter((u) => u.id !== id);
    return Promise.resolve();
  }
}

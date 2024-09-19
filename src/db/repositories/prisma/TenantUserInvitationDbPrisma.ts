import { prisma } from "@/db/config/prisma/database";
import { ITenantUserInvitationDb } from "@/db/interfaces/accounts/ITenantUserInvitationDb";
import { TenantUserInvitationModel, TenantUserInvitationWithTenantDto } from "@/db/models";

export class TenantUserInvitationDbPrisma implements ITenantUserInvitationDb {
  async get(id: string): Promise<TenantUserInvitationWithTenantDto | null> {
    return await prisma.tenantUserInvitation.findUnique({
      where: {
        id,
      },
      include: {
        tenant: true,
      },
    });
  }

  async getPending(tenantId: string): Promise<TenantUserInvitationModel[]> {
    return await prisma.tenantUserInvitation.findMany({
      where: {
        tenantId,
        pending: true,
      },
    });
  }

  async create(data: Omit<TenantUserInvitationModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const item = await prisma.tenantUserInvitation.create({
      data: {
        tenantId: data.tenantId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fromUserId: data.fromUserId,
        pending: true,
      },
    });

    return item.id;
  }

  async update(id: string, data: { pending?: boolean }): Promise<void> {
    await prisma.tenantUserInvitation.update({
      where: {
        id,
      },
      data: {
        pending: data.pending,
      },
    });
  }

  async del(id: string): Promise<void> {
    await prisma.tenantUserInvitation.delete({
      where: {
        id,
      },
    });
  }
}

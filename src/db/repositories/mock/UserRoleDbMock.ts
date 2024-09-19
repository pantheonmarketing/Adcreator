import { mockDb } from "@/db/config/mock/data/mockDb";
import { IUserRoleDb } from "@/db/interfaces/permissions/IUserRoleDb";
import { UserRoleModel, UserRoleWithDetailsDto } from "@/db/models";

export class UserRoleDbMock implements IUserRoleDb {
  withDetails(item: UserRoleModel): UserRoleWithDetailsDto {
    return {
      ...item,
      role: {
        ...mockDb.role[0],
        permissions: [],
      },
    };
  }
  get(params: { userId: string; roleId: string; tenantId: string | null }): Promise<UserRoleModel | null> {
    return Promise.resolve(mockDb.userRole[0]);
  }
  getInTenant(userId: string, tenantId: string, roleName: string): Promise<UserRoleModel | null> {
    return Promise.resolve(mockDb.userRole[0]);
  }
  getInAdmin(userId: string, roleName: string): Promise<UserRoleModel | null> {
    return Promise.resolve(mockDb.userRole[0]);
  }
  getPermissionsByUser(userId: string, tenantId: string | null): Promise<UserRoleWithDetailsDto[]> {
    return Promise.resolve(mockDb.userRole.map((ur) => this.withDetails(ur)));
  }
  countPermissionByUser(userId: string, tenantId: string | null, permissionName: string): Promise<number> {
    return Promise.resolve(1);
  }
  create(data: { userId: string; roleId: string; tenantId: string | null }): Promise<string> {
    return Promise.resolve("1");
  }
  createMany(userId: string, roles: { id: string; tenantId: string | null }[]): Promise<void> {
    return Promise.resolve();
  }
  del(userId: string, roleId: string): Promise<void> {
    return Promise.resolve();
  }
  deleteAllByUser(userId: string, type: string): Promise<void> {
    return Promise.resolve();
  }
}

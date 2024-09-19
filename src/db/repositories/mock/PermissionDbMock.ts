import { mockDb } from "@/db/config/mock/data/mockDb";
import { IPermissionDb } from "@/db/interfaces/permissions/IPermissionDb";
import { IUserRoleDb } from "@/db/interfaces/permissions/IUserRoleDb";
import { PermissionDto, PermissionModel, PermissionWithRolesDto, UserRoleModel, UserRoleWithDetailsDto } from "@/db/models";

export class PermissionDbMock implements IPermissionDb {
  withRoles(item: PermissionModel): PermissionWithRolesDto {
    return {
      ...item,
      inRoles: [],
    };
  }
  getAll(filters?: { type?: string; roleId?: string | null }): Promise<PermissionWithRolesDto[]> {
    return Promise.resolve(mockDb.permission.map((p) => this.withRoles(p)));
  }
  getAllIdsAndNames(): Promise<PermissionDto[]> {
    return Promise.resolve(mockDb.permission);
  }
  get(id: string): Promise<PermissionWithRolesDto | null> {
    const item = mockDb.permission.find((p) => p.id === id);
    return item ? Promise.resolve(this.withRoles(item)) : Promise.resolve(null);
  }
  getByName(name: string): Promise<PermissionDto | null> {
    const item = mockDb.permission.find((p) => p.name === name);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getMaxOrder(type: "admin" | "app"): Promise<number> {
    return Promise.resolve(1);
  }
  create(data: { order: number; name: string; description: string; type: string; isDefault: boolean }): Promise<string> {
    return Promise.resolve("1");
  }
  update(id: string, data: { name?: string; description?: string; type?: string; order?: number }): Promise<void> {
    return Promise.resolve();
  }
  del(id: string): Promise<void> {
    return Promise.resolve();
  }
}

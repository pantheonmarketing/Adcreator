import { createId } from "@paralleldrive/cuid2";
import { mockDb } from "@/db/config/mock/data/mockDb";
import { IUserDb } from "@/db/interfaces/accounts/IUserDb";
import { IRoleDb } from "@/db/interfaces/permissions/IRoleDb";
import { ICreditDb } from "@/db/interfaces/subscriptions/ICreditDb";
import {
  UserModel,
  UserDto,
  UserWithDetailsDto,
  CreditWithDetailsDto,
  CreditModel,
  RoleModel,
  RoleWithPermissionsAndUsersDto,
  RoleWithPermissionsDto,
} from "@/db/models";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";

export class RoleDbMock implements IRoleDb {
  withPermissions(item: RoleModel): RoleWithPermissionsDto {
    return {
      ...item,
      permissions: [],
    };
  }
  getAll(type?: "admin" | "app"): Promise<RoleWithPermissionsDto[]> {
    return Promise.resolve(mockDb.role.map((r) => this.withPermissions(r)));
  }
  getAllNames(): Promise<{ id: string; name: string }[]> {
    return Promise.resolve(mockDb.role.map((r) => ({ id: r.id, name: r.name })));
  }
  getAllWithoutPermissions(type?: "admin" | "app"): Promise<RoleModel[]> {
    return Promise.resolve(mockDb.role);
  }
  getAllWithUsers(filters?: { type?: "admin" | "app"; permissionId?: string | null }): Promise<RoleWithPermissionsAndUsersDto[]> {
    return Promise.resolve(mockDb.role.map((r) => ({ ...this.withPermissions(r), users: [] })));
  }
  getAllInIds(ids: string[]): Promise<RoleWithPermissionsAndUsersDto[]> {
    return Promise.resolve(
      mockDb.role
        .filter((r) => ids.includes(r.id))
        .map((r) => ({
          ...this.withPermissions(r),
          users: [],
        }))
    );
  }
  get(id: string): Promise<RoleWithPermissionsDto | null> {
    const item = mockDb.role.find((r) => r.id === id);
    return item ? Promise.resolve(this.withPermissions(item)) : Promise.resolve(null);
  }
  getByName(name: string): Promise<RoleWithPermissionsDto | null> {
    const item = mockDb.role.find((r) => r.name === name);
    return item ? Promise.resolve(this.withPermissions(item)) : Promise.resolve(null);
  }
  getMaxOrder(type?: "admin" | "app"): Promise<number> {
    return Promise.resolve(1);
  }
  create(data: { order: number; name: string; description: string; type: "admin" | "app"; assignToNewUsers: boolean; isDefault: boolean }): Promise<string> {
    return Promise.resolve(createId());
  }
  update(id: string, data: { name: string; description: string; type: "admin" | "app"; assignToNewUsers: boolean }): Promise<void> {
    return Promise.resolve();
  }
  del(id: string): Promise<void> {
    return Promise.resolve();
  }
}

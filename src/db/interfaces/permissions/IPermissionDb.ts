import { PermissionDto, PermissionWithRolesDto } from "../../models";

export interface IPermissionDb {
  getAll(filters?: { type?: string; roleId?: string | null }): Promise<PermissionWithRolesDto[]>;
  getAllIdsAndNames(): Promise<PermissionDto[]>;
  get(id: string): Promise<PermissionWithRolesDto | null>;
  getByName(name: string): Promise<PermissionDto | null>;
  getMaxOrder(type: "admin" | "app"): Promise<number>;
  create(data: { order: number; name: string; description: string; type: string; isDefault: boolean }): Promise<string>;
  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      type?: string;
      order?: number;
    }
  ): Promise<void>;
  del(id: string): Promise<void>;
}

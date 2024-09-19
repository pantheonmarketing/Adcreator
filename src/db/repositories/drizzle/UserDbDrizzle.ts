import { createId } from "@paralleldrive/cuid2";
import { and, count, eq, inArray, sql, SQL } from "drizzle-orm";
import { drizzleDb } from "@/db/config/drizzle/database";
import { TenantUser, User } from "@/db/config/drizzle/schema";
import { IUserDb } from "@/db/interfaces/accounts/IUserDb";
import { UserModel, UserDto, UserWithDetailsDto } from "@/db/models";
import { PaginationDto, SortedByDto } from "@/lib/dtos/PaginationDto";

export class UserDbDrizzle implements IUserDb {
  async getAllWhereTenant(tenantId: string): Promise<UserWithDetailsDto[]> {
    const items = await drizzleDb.query.User.findMany({
      where: and(inArray(User.id, drizzleDb.select({ userId: TenantUser.userId }).from(TenantUser).where(eq(TenantUser.tenantId, tenantId)))),
      with: {
        tenants: {
          with: {
            tenant: true,
          },
          // where: (TenantUser, { eq }) => eq(TenantUser.tenantId, tenantId),
        },
        roles: {
          with: {
            role: true,
          },
        },
      },
    });
    return items;
  }
  async getAllWithPagination({
    filters,
    pagination,
  }: {
    filters?: { email?: string; firstName?: string; lastName?: string; tenantId?: string | null; admin?: boolean | undefined } | undefined;
    pagination?: { page: number; pageSize: number; sortedBy?: SortedByDto[] | undefined } | undefined;
  }): Promise<{ items: UserWithDetailsDto[]; pagination: PaginationDto }> {
    let whereConditions: SQL[] = [];

    if (filters?.email) {
      whereConditions.push(sql`LOWER(${User.email}) LIKE LOWER(${`%${filters.email}%`})`);
    }
    if (filters?.firstName) {
      whereConditions.push(sql`LOWER(${User.firstName}) LIKE LOWER(${`%${filters.firstName}%`})`);
    }
    if (filters?.lastName) {
      whereConditions.push(sql`LOWER(${User.lastName}) LIKE LOWER(${`%${filters.lastName}%`})`);
    }
    if (filters?.tenantId) {
      const tenantUserSubquery = drizzleDb.select({ userId: TenantUser.userId }).from(TenantUser).where(eq(TenantUser.tenantId, filters.tenantId));
      whereConditions.push(inArray(User.id, tenantUserSubquery));
    }
    if (filters?.admin !== undefined) {
      whereConditions.push(eq(User.admin, filters.admin));
    }

    // let orderBy: SQL[] = [asc(User.createdAt)];
    // if (pagination?.sortedBy?.length) {
    //   pagination.sortedBy = pagination.sortedBy.filter((s) => ["email", "firstName", "lastName", "createdAt"].includes(s.name));
    //   orderBy = pagination.sortedBy.map((s) => (s.direction === "desc" ? desc(s.name) : asc(s.name)));
    // }

    const users = await drizzleDb.query.User.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        tenants: {
          with: {
            tenant: true,
          },
        },
        roles: {
          with: {
            role: true,
          },
        },
      },
      limit: pagination?.pageSize,
      offset: pagination ? pagination.pageSize * (pagination.page - 1) : undefined,
      // orderBy,
    });

    const totalItems = (
      await drizzleDb
        .select({ count: count() })
        .from(User)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    )[0].count;

    return {
      items: users,
      pagination: {
        page: pagination?.page ?? 1,
        pageSize: pagination?.pageSize ?? 10,
        totalItems,
        totalPages: Math.ceil(totalItems / (pagination?.pageSize ?? 10)),
      },
    };
  }
  getAll(): Promise<UserWithDetailsDto[]> {
    return drizzleDb.query.User.findMany({
      with: {
        tenants: {
          with: {
            tenant: true,
          },
        },
        roles: {
          with: {
            role: true,
          },
        },
      },
    });
  }
  async get(userId: string): Promise<UserDto | null> {
    const items = await drizzleDb
      .select({
        id: User.id,
        email: User.email,
        firstName: User.firstName,
        lastName: User.lastName,
        avatar: User.avatar,
        admin: User.admin,
        defaultTenantId: User.defaultTenantId,
        locale: User.locale,
      })
      .from(User)
      .where(eq(User.id, userId))
      .execute();
    if (items.length === 0) {
      return null;
    }
    return items[0];
  }
  async getByEmail(email: string): Promise<UserDto | null> {
    const items = await drizzleDb
      .select({
        id: User.id,
        email: User.email,
        firstName: User.firstName,
        lastName: User.lastName,
        avatar: User.avatar,
        admin: User.admin,
        defaultTenantId: User.defaultTenantId,
        locale: User.locale,
      })
      .from(User)
      .where(eq(User.email, email))
      .execute();
    if (items.length === 0) {
      return null;
    }
    return items[0];
  }
  async getByEmailWithDetails(email: string): Promise<UserWithDetailsDto | null> {
    const items = await drizzleDb.query.User.findMany({
      where: eq(User.email, email),
      with: {
        tenants: {
          with: {
            tenant: true,
          },
        },
        roles: {
          with: {
            role: true,
          },
        },
      },
    });
    return items.length === 0 ? null : items[0];
  }
  async getPasswordHash(id: string): Promise<string | null> {
    const items = await drizzleDb.select({ passwordHash: User.passwordHash }).from(User).where(eq(User.id, id)).execute();
    return items.length === 0 ? null : items[0].passwordHash;
  }
  async getVerifyToken(id: string): Promise<string | null> {
    const items = await drizzleDb.select({ verifyToken: User.verifyToken }).from(User).where(eq(User.id, id)).execute();
    return items.length === 0 ? null : items[0].verifyToken;
  }
  async count(): Promise<number> {
    return drizzleDb
      .select({ count: count() })
      .from(User)
      .execute()
      .then((items) => items[0].count);
  }
  async create(data: Omit<UserModel, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const id = createId();
    await drizzleDb.insert(User).values({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      active: data.active,
      admin: data.admin,
      avatar: data.avatar,
      locale: data.locale,
      phone: data.phone,
      defaultTenantId: data.defaultTenantId,
    });
    return id;
  }
  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatar?: string | null;
      locale?: string | null;
      verifyToken?: string | null;
      passwordHash?: string;
      defaultTenantId?: string | null;
      admin?: boolean;
    }
  ): Promise<void> {
    await drizzleDb
      .update(User)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        locale: data.locale,
        verifyToken: data.verifyToken,
        passwordHash: data.passwordHash,
        defaultTenantId: data.defaultTenantId,
        admin: data.admin,
      })
      .where(eq(User.id, id))
      .execute();
  }
  async del(id: string): Promise<void> {
    await drizzleDb.delete(User).where(eq(User.id, id)).execute();
  }
  async deleteAll(): Promise<void> {
    await drizzleDb.delete(User).execute();
  }
}

import { autosubscribeToTrialOrFreePlan } from "@/modules/subscriptions/services/PricingService";
import UrlUtils from "@/lib/utils/UrlUtils";
import { db } from "@/db";
import { createTenantSubscription, updateTenantSubscription } from "@/modules/subscriptions/services/TenantSubscriptionService";
import { stripeService } from "@/modules/subscriptions/services/StripeService";
import { createUserRole } from "@/modules/permissions/services/UserRolesService";
import { RoleModel, TenantDto, TenantModel, TenantWithDetailsDto } from "@/db/models";
import { cachified, clearCacheKey } from "@/lib/services/cache.server";
import { deleteUser, getUser, updateUser } from "./UserService";

export async function getTenant(id: string): Promise<TenantWithDetailsDto | null> {
  return await cachified({
    key: `tenant:${id}`,
    ttl: 1000 * 60 * 60 * 24,
    getFreshValue: () => db.tenant.get(id),
  });
}

export async function createTenant({
  name,
  slug,
  userId,
  icon,
  stripeCustomerId,
}: {
  name: string;
  slug?: string;
  userId: string;
  icon?: string | null;
  stripeCustomerId?: string | undefined;
}) {
  const user = await getUser(userId);
  if (!user) {
    throw Error("User not found");
  }
  slug = await getNextAvailableTenantSlug({ name, slug });
  const tenantId = await db.tenant.create({
    name,
    slug,
    icon: icon || null,
    active: true,
  });
  const tenant = await getTenant(tenantId);
  if (!tenant) {
    throw Error("Tenant not found");
  }

  await updateUser(user?.id, { defaultTenantId: tenant.id });

  if (process.env.STRIPE_SK && !stripeCustomerId) {
    const stripeCustomer = await stripeService.createStripeCustomer(user.email, name);
    if (!stripeCustomer) {
      throw new Error("Could not create Stripe customer");
    }
    stripeCustomerId = stripeCustomer.id;
  }
  if (stripeCustomerId) {
    await createTenantSubscription(tenant.id, stripeCustomerId);
    await autosubscribeToTrialOrFreePlan({ tenantId: tenant.id });
  }

  return tenant;
}

async function getNextAvailableTenantSlug({ name, slug }: { name: string; slug?: string }) {
  if (slug === undefined) {
    slug = UrlUtils.slugify(name);
  }
  let tries = 1;
  do {
    const existingSlug = await tenantSlugAlreadyExists(slug);
    if (existingSlug) {
      slug = UrlUtils.slugify(name) + tries.toString();
      tries++;
    } else {
      break;
    }
  } while (true);
  return slug;
}

export async function tenantSlugAlreadyExists(slug: string) {
  if (["new-account", "undefined", "null"].includes(slug)) {
    return true;
  }
  const existing = await db.tenant.countBySlug(slug);
  return existing > 0;
}

export async function getTenantIdFromUrl(params?: { tenant?: string }) {
  const tenant = params?.tenant;
  const tenantId = await cachified({
    key: `tenantIdOrSlug:${tenant}`,
    ttl: 1000 * 60 * 60 * 24,
    getFreshValue: () => db.tenant.getIdByIdOrSlug(tenant),
  });
  if (!tenantId) {
    throw Error("Account not found with slug: " + tenant);
  }
  return tenantId;
}

export async function getTenantSimple(id: string): Promise<TenantDto | null> {
  return await cachified({
    key: `tenantSimple:${id}`,
    ttl: 1000 * 60 * 60 * 24,
    getFreshValue: () => db.tenant.getSimple(id),
  });
}

export async function getTenantByIdOrSlug(id: string): Promise<TenantDto | null> {
  return await cachified({
    key: `tenantIdOrSlug:${id}`,
    ttl: 1000 * 60 * 60 * 24,
    getFreshValue: () => db.tenant.getByIdOrSlug(id),
  });
}

export async function updateTenant(before: { id: string; slug: string }, data: { name?: string; icon?: string; slug?: string }): Promise<void> {
  await db.tenant.update(before.id, { name: data.name, icon: data.icon, slug: data.slug }).then((item) => {
    console.log("clearing", {
      tenant: `tenant:${before.slug}`,
      tenantId: `tenant:${before.id}`,
      tenantIdOrSlug: `tenantIdOrSlug:${before.id}`,
      tenantIdOrSlug2: `tenantIdOrSlug:${before.slug}`,
      tenantSimple: `tenantSimple:${before.id}`,
    });
    clearCacheKey(`tenant:${before.slug}`);
    clearCacheKey(`tenant:${before.id}`);
    clearCacheKey(`tenantIdOrSlug:${before.id}`);
    clearCacheKey(`tenantIdOrSlug:${before.slug}`);
    clearCacheKey(`tenantSimple:${before.id}`);
    if (data.slug) {
      clearCacheKey(`tenant:${data.slug}`);
      clearCacheKey(`tenantIdOrSlug:${data.slug}`);
    }
    return item;
  });
}

export async function deleteUserWithItsTenants(id: string) {
  const userTenants = await db.tenant.getByUser(id);
  const deletedAccounts: TenantModel[] = [];
  await Promise.all(
    userTenants.map(async ({ id }) => {
      const tenant = await getTenant(id);
      if (tenant?.users.length === 1 && tenant.users[0].userId === id) {
        // If the user is the only user in the tenant, delete the tenant
        await deleteAndCancelTenant(id);
        deletedAccounts.push(tenant);
      }
    })
  );
  const deletedTenants: TenantModel[] = [];
  deletedAccounts.forEach((deletedAccount) => {
    if (deletedAccount) {
      deletedTenants.push(deletedAccount);
    }
  });
  return {
    deletedUser: await deleteUser(id),
    deletedTenants,
  };
}

export async function deleteAndCancelTenant(id: string) {
  const tenantSubscription = await db.tenantSubscription.get(id);
  if (tenantSubscription?.products) {
    await Promise.all(
      tenantSubscription.products.map(async (product) => {
        if (product?.stripeSubscriptionId) {
          await stripeService.cancelStripeSubscription(product?.stripeSubscriptionId);
        }
      })
    );
  }
  if (tenantSubscription?.stripeCustomerId) {
    await stripeService.deleteStripeCustomer(tenantSubscription?.stripeCustomerId);
  }
  return await deleteTenant(id);
}

export async function deleteTenant(id: string): Promise<void> {
  await db.tenant.del(id).then(() => {
    clearCacheKey(`tenant:${id}`);
    clearCacheKey(`tenantIdOrSlug:${id}`);
    clearCacheKey(`tenantSimple:${id}`);
  });
}

export async function addTenantUser({ tenantId, userId }: { tenantId: string; userId: string }) {
  const tenantUserId = await db.tenantUser.create({
    tenantId,
    userId,
  });
  const tenantUser = await db.tenantUser.getById(tenantUserId);
  if (!tenantUser) {
    throw Error("Could not create tenant user");
  }

  const roles = await db.role.getAll("app");
  const assignToNewUsersRoles = roles.filter((f) => f.assignToNewUsers);

  await Promise.all(
    assignToNewUsersRoles.map(async (role) => {
      return await createUserRole({
        userId: tenantUser.userId,
        roleId: role.id,
        tenantId: tenantUser.tenantId,
      });
    })
  );

  return tenantUser;
}

import { pgTable, uniqueIndex, foreignKey, text, timestamp, integer, numeric, boolean, varchar, index, date, decimal } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const TenantUser = pgTable(
  "TenantUser",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    tenantId: text("tenantId")
      .notNull()
      .references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      tenantId_userId_key: uniqueIndex("TenantUser_tenantId_userId_key").using("btree", table.tenantId, table.userId),
    };
  }
);

export const SubscriptionPrice = pgTable("SubscriptionPrice", {
  id: text("id").primaryKey().notNull(),
  subscriptionProductId: text("subscriptionProductId")
    .notNull()
    .references(() => SubscriptionProduct.id, { onDelete: "cascade", onUpdate: "cascade" }),
  stripeId: text("stripeId").notNull(),
  type: integer("type").notNull(),
  billingPeriod: integer("billingPeriod").notNull(),
  price: decimal("price", { precision: 65, scale: 30 }).$type<number>().notNull(),
  currency: text("currency").notNull(),
  trialDays: integer("trialDays").notNull(),
  active: boolean("active").notNull(),
});

export const UserRegistrationAttempt = pgTable(
  "UserRegistrationAttempt",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    slug: text("slug"),
    token: text("token").notNull(),
    ipAddress: text("ipAddress"),
    company: text("company"),
    createdTenantId: text("createdTenantId").references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      createdTenantId_key: uniqueIndex("UserRegistrationAttempt_createdTenantId_key").using("btree", table.createdTenantId),
      email_key: uniqueIndex("UserRegistrationAttempt_email_key").using("btree", table.email),
      token_key: uniqueIndex("UserRegistrationAttempt_token_key").using("btree", table.token),
    };
  }
);

export const _prisma_migrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finished_at: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migration_name: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolled_back_at: timestamp("rolled_back_at", { withTimezone: true, mode: "string" }),
  started_at: timestamp("started_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  applied_steps_count: integer("applied_steps_count").default(0).notNull(),
});

export const TenantUserInvitation = pgTable(
  "TenantUserInvitation",
  {
    id: text("id").primaryKey().notNull(),
    tenantId: text("tenantId")
      .notNull()
      .references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
    email: text("email").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    pending: boolean("pending").notNull(),
    createdUserId: text("createdUserId").references(() => User.id, { onDelete: "set null", onUpdate: "cascade" }),
    fromUserId: text("fromUserId").references(() => User.id, { onDelete: "set null", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      createdUserId_key: uniqueIndex("TenantUserInvitation_createdUserId_key").using("btree", table.createdUserId),
    };
  }
);

export const User = pgTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    passwordHash: text("passwordHash").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    avatar: text("avatar"),
    phone: text("phone"),
    defaultTenantId: text("defaultTenantId"),
    verifyToken: text("verifyToken"),
    locale: text("locale"),
    active: boolean("active").default(false).notNull(),
    admin: boolean("admin").default(false).notNull(),
  },
  (table) => {
    return {
      email_key: uniqueIndex("User_email_key").using("btree", table.email),
    };
  }
);

export const Permission = pgTable(
  "Permission",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(),
    isDefault: boolean("isDefault").notNull(),
    order: integer("order").notNull(),
  },
  (table) => {
    return {
      name_key: uniqueIndex("Permission_name_key").using("btree", table.name),
    };
  }
);

export const RolePermission = pgTable("RolePermission", {
  id: text("id").primaryKey().notNull(),
  roleId: text("roleId")
    .notNull()
    .references(() => Role.id, { onDelete: "cascade", onUpdate: "cascade" }),
  permissionId: text("permissionId")
    .notNull()
    .references(() => Permission.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const AppConfiguration = pgTable("AppConfiguration", {
  id: text("id").primaryKey().notNull(),
  updatedAt: date("updatedAt", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  theme: text("theme"),
  authRequireEmailVerification: boolean("authRequireEmailVerification").default(false).notNull(),
  authRequireOrganization: boolean("authRequireOrganization").default(true).notNull(),
  authRequireName: boolean("authRequireName").default(true).notNull(),
  analyticsSimpleAnalytics: boolean("analyticsSimpleAnalytics").default(false).notNull(),
  analyticsPlausibleAnalytics: boolean("analyticsPlausibleAnalytics").default(false).notNull(),
  analyticsGoogleAnalyticsTrackingId: text("analyticsGoogleAnalyticsTrackingId"),
  subscriptionRequired: boolean("subscriptionRequired").default(true).notNull(),
  subscriptionAllowSubscribeBeforeSignUp: boolean("subscriptionAllowSubscribeBeforeSignUp").default(true).notNull(),
  subscriptionAllowSignUpBeforeSubscribe: boolean("subscriptionAllowSignUpBeforeSubscribe").default(true).notNull(),
  brandingLogo: text("brandingLogo"),
  brandingLogoDarkMode: text("brandingLogoDarkMode"),
  brandingIcon: text("brandingIcon"),
  brandingIconDarkMode: text("brandingIconDarkMode"),
  brandingFavicon: text("brandingFavicon"),
  headScripts: text("headScripts"),
  bodyScripts: text("bodyScripts"),
});

export const UserRole = pgTable("UserRole", {
  id: text("id").primaryKey().notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
  roleId: text("roleId")
    .notNull()
    .references(() => Role.id, { onDelete: "cascade", onUpdate: "cascade" }),
  tenantId: text("tenantId").references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const Role = pgTable(
  "Role",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(),
    assignToNewUsers: boolean("assignToNewUsers").notNull(),
    isDefault: boolean("isDefault").notNull(),
    order: integer("order").notNull(),
  },
  (table) => {
    return {
      name_key: uniqueIndex("Role_name_key").using("btree", table.name),
    };
  }
);

export const SubscriptionProduct = pgTable("SubscriptionProduct", {
  id: text("id").primaryKey().notNull(),
  stripeId: text("stripeId").notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  active: boolean("active").notNull(),
  model: integer("model").notNull(),
  public: boolean("public").notNull(),
  groupTitle: text("groupTitle"),
  groupDescription: text("groupDescription"),
  description: text("description"),
  badge: text("badge"),
  billingAddressCollection: text("billingAddressCollection").default("auto").notNull(),
  hasQuantity: boolean("hasQuantity").default(false).notNull(),
  canBuyAgain: boolean("canBuyAgain").default(false).notNull(),
});

export const Tenant = pgTable(
  "Tenant",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    icon: text("icon"),
    subscriptionId: text("subscriptionId"),
    active: boolean("active").default(false).notNull(),
  },
  (table) => {
    return {
      slug_idx: index("Tenant_slug_idx").using("btree", table.slug),
      slug_key: uniqueIndex("Tenant_slug_key").using("btree", table.slug),
    };
  }
);

export const TenantSubscriptionProduct = pgTable("TenantSubscriptionProduct", {
  id: text("id").primaryKey().notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull(),
  tenantSubscriptionId: text("tenantSubscriptionId")
    .notNull()
    .references(() => TenantSubscription.id, { onDelete: "cascade", onUpdate: "cascade" }),
  subscriptionProductId: text("subscriptionProductId")
    .notNull()
    .references(() => SubscriptionProduct.id, { onDelete: "restrict", onUpdate: "cascade" }),
  cancelledAt: date("cancelledAt", { mode: "date" }),
  endsAt: date("endsAt", { mode: "date" }),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  quantity: integer("quantity"),
  fromCheckoutSessionId: text("fromCheckoutSessionId"),
  currentPeriodStart: date("currentPeriodStart", { mode: "date" }),
  currentPeriodEnd: date("currentPeriodEnd", { mode: "date" }),
});

export const SubscriptionUsageBasedPrice = pgTable("SubscriptionUsageBasedPrice", {
  id: text("id").primaryKey().notNull(),
  subscriptionProductId: text("subscriptionProductId")
    .notNull()
    .references(() => SubscriptionProduct.id, { onDelete: "cascade", onUpdate: "cascade" }),
  stripeId: text("stripeId").notNull(),
  billingPeriod: integer("billingPeriod").notNull(),
  currency: text("currency").notNull(),
  unit: text("unit").notNull(),
  unitTitle: text("unitTitle").notNull(),
  unitTitlePlural: text("unitTitlePlural").notNull(),
  usageType: text("usageType").notNull(),
  aggregateUsage: text("aggregateUsage").notNull(),
  tiersMode: text("tiersMode").notNull(),
  billingScheme: text("billingScheme").notNull(),
});

export const SubscriptionUsageBasedTier = pgTable("SubscriptionUsageBasedTier", {
  id: text("id").primaryKey().notNull(),
  subscriptionUsageBasedPriceId: text("subscriptionUsageBasedPriceId")
    .notNull()
    .references(() => SubscriptionUsageBasedPrice.id, { onDelete: "cascade", onUpdate: "cascade" }),
  from: integer("from").notNull(),
  to: integer("to"),
  perUnitPrice: decimal("perUnitPrice", { precision: 65, scale: 30 }).$type<number>(),
  flatFeePrice: decimal("flatFeePrice", { precision: 65, scale: 30 }).$type<number>(),
});

export const SubscriptionFeature = pgTable("SubscriptionFeature", {
  id: text("id").primaryKey().notNull(),
  subscriptionProductId: text("subscriptionProductId")
    .notNull()
    .references(() => SubscriptionProduct.id, { onDelete: "cascade", onUpdate: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  name: text("name").notNull(),
  type: integer("type").notNull(),
  value: integer("value").notNull(),
  href: text("href"),
  badge: text("badge"),
  accumulate: boolean("accumulate").default(false).notNull(),
});

export const TenantSubscription = pgTable(
  "TenantSubscription",
  {
    id: text("id").primaryKey().notNull(),
    tenantId: text("tenantId")
      .notNull()
      .references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
    stripeCustomerId: text("stripeCustomerId"),
  },
  (table) => {
    return {
      tenantId_key: uniqueIndex("TenantSubscription_tenantId_key").using("btree", table.tenantId),
    };
  }
);

export const TenantSubscriptionProductPrice = pgTable("TenantSubscriptionProductPrice", {
  id: text("id").primaryKey().notNull(),
  tenantSubscriptionProductId: text("tenantSubscriptionProductId")
    .notNull()
    .references(() => TenantSubscriptionProduct.id, { onDelete: "cascade", onUpdate: "cascade" }),
  subscriptionPriceId: text("subscriptionPriceId").references(() => SubscriptionPrice.id, { onDelete: "set null", onUpdate: "cascade" }),
  subscriptionUsageBasedPriceId: text("subscriptionUsageBasedPriceId").references(() => SubscriptionUsageBasedPrice.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const TenantSubscriptionUsageRecord = pgTable("TenantSubscriptionUsageRecord", {
  id: text("id").primaryKey().notNull(),
  tenantSubscriptionProductPriceId: text("tenantSubscriptionProductPriceId")
    .notNull()
    .references(() => TenantSubscriptionProductPrice.id, { onDelete: "cascade", onUpdate: "cascade" }),
  timestamp: integer("timestamp").notNull(),
  quantity: integer("quantity").notNull(),
  stripeSubscriptionItemId: text("stripeSubscriptionItemId"),
});

export const Credit = pgTable(
  "Credit",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    tenantId: text("tenantId")
      .notNull()
      .references(() => Tenant.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("userId").references(() => User.id, { onDelete: "set null", onUpdate: "cascade" }),
    amount: integer("amount").notNull(),
    type: text("type").notNull(),
    objectId: text("objectId"),
  },
  (table) => {
    return {
      tenantId_createdAt_idx: index("Credit_tenantId_createdAt_idx").using("btree", table.tenantId, table.createdAt),
      tenantId_userId_idx: index("Credit_tenantId_userId_idx").using("btree", table.tenantId, table.userId),
    };
  }
);

export const CheckoutSessionStatus = pgTable(
  "CheckoutSessionStatus",
  {
    createdAt: date("createdAt", { mode: "date" }).notNull(),
    updatedAt: date("updatedAt", { mode: "date" }).notNull(),
    id: text("id").notNull(),
    pending: boolean("pending").default(true).notNull(),
    email: text("email").notNull(),
    fromUrl: text("fromUrl").notNull(),
    fromUserId: text("fromUserId"),
    fromTenantId: text("fromTenantId"),
    createdUserId: text("createdUserId"),
    createdTenantId: text("createdTenantId"),
  },
  (table) => {
    return {
      id_key: uniqueIndex("CheckoutSessionStatus_id_key").using("btree", table.id),
    };
  }
);

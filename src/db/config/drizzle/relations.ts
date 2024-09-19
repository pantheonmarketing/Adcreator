import { relations } from "drizzle-orm/relations";
import {
  Tenant,
  TenantUser,
  User,
  SubscriptionProduct,
  SubscriptionPrice,
  UserRegistrationAttempt,
  TenantUserInvitation,
  Permission,
  RolePermission,
  Role,
  UserRole,
  TenantSubscription,
  TenantSubscriptionProduct,
  SubscriptionUsageBasedPrice,
  SubscriptionUsageBasedTier,
  SubscriptionFeature,
  TenantSubscriptionProductPrice,
  TenantSubscriptionUsageRecord,
  Credit,
} from "./schema";

export const TenantUserRelations = relations(TenantUser, ({ one }) => ({
  tenant: one(Tenant, {
    fields: [TenantUser.tenantId],
    references: [Tenant.id],
  }),
  user: one(User, {
    fields: [TenantUser.userId],
    references: [User.id],
  }),
}));

export const TenantRelations = relations(Tenant, ({ many, one }) => ({
  users: many(TenantUser),
  fromRegistration: many(UserRegistrationAttempt),
  invitations: many(TenantUserInvitation),
  userRoles: many(UserRole),
  subscription: one(TenantSubscription),
  credits: many(Credit),
}));

export const UserRelations = relations(User, ({ many }) => ({
  tenants: many(TenantUser),
  sentInvitations: many(TenantUserInvitation, {
    relationName: "TenantUserInvitation_fromUserId_User_id",
  }),
  invitation: many(TenantUserInvitation, {
    relationName: "TenantUserInvitation_createdUserId_User_id",
  }),
  roles: many(UserRole),
  credits: many(Credit),
}));

export const SubscriptionPriceRelations = relations(SubscriptionPrice, ({ one, many }) => ({
  subscriptionProduct: one(SubscriptionProduct, {
    fields: [SubscriptionPrice.subscriptionProductId],
    references: [SubscriptionProduct.id],
  }),
  tenantProductPrices: many(TenantSubscriptionProductPrice),
}));

export const SubscriptionProductRelations = relations(SubscriptionProduct, ({ many }) => ({
  prices: many(SubscriptionPrice),
  tenantProducts: many(TenantSubscriptionProduct),
  usageBasedPrices: many(SubscriptionUsageBasedPrice),
  features: many(SubscriptionFeature),
}));

export const UserRegistrationAttemptRelations = relations(UserRegistrationAttempt, ({ one }) => ({
  createdTenant: one(Tenant, {
    fields: [UserRegistrationAttempt.createdTenantId],
    references: [Tenant.id],
  }),
}));

export const TenantUserInvitationRelations = relations(TenantUserInvitation, ({ one }) => ({
  fromUser: one(User, {
    fields: [TenantUserInvitation.fromUserId],
    references: [User.id],
    relationName: "TenantUserInvitation_fromUserId_User_id",
  }),
  user: one(User, {
    fields: [TenantUserInvitation.createdUserId],
    references: [User.id],
    relationName: "TenantUserInvitation_createdUserId_User_id",
  }),
  tenant: one(Tenant, {
    fields: [TenantUserInvitation.tenantId],
    references: [Tenant.id],
  }),
}));

export const RolePermissionRelations = relations(RolePermission, ({ one }) => ({
  permission: one(Permission, {
    fields: [RolePermission.permissionId],
    references: [Permission.id],
  }),
  role: one(Role, {
    fields: [RolePermission.roleId],
    references: [Role.id],
  }),
}));

export const PermissionRelations = relations(Permission, ({ many }) => ({
  inRoles: many(RolePermission),
}));

export const RoleRelations = relations(Role, ({ many }) => ({
  permissions: many(RolePermission),
  users: many(UserRole),
}));

export const UserRoleRelations = relations(UserRole, ({ one }) => ({
  role: one(Role, {
    fields: [UserRole.roleId],
    references: [Role.id],
  }),
  tenant: one(Tenant, {
    fields: [UserRole.tenantId],
    references: [Tenant.id],
  }),
  user: one(User, {
    fields: [UserRole.userId],
    references: [User.id],
  }),
}));

export const TenantSubscriptionProductRelations = relations(TenantSubscriptionProduct, ({ one, many }) => ({
  tenantSubscription: one(TenantSubscription, {
    fields: [TenantSubscriptionProduct.tenantSubscriptionId],
    references: [TenantSubscription.id],
  }),
  subscriptionProduct: one(SubscriptionProduct, {
    fields: [TenantSubscriptionProduct.subscriptionProductId],
    references: [SubscriptionProduct.id],
  }),
  prices: many(TenantSubscriptionProductPrice),
}));

export const TenantSubscriptionRelations = relations(TenantSubscription, ({ one, many }) => ({
  products: many(TenantSubscriptionProduct),
  tenant: one(Tenant, {
    fields: [TenantSubscription.tenantId],
    references: [Tenant.id],
  }),
}));

export const SubscriptionUsageBasedPriceRelations = relations(SubscriptionUsageBasedPrice, ({ one, many }) => ({
  subscriptionProduct: one(SubscriptionProduct, {
    fields: [SubscriptionUsageBasedPrice.subscriptionProductId],
    references: [SubscriptionProduct.id],
  }),
  tiers: many(SubscriptionUsageBasedTier),
  tenantProductPrices: many(TenantSubscriptionProductPrice),
}));

export const SubscriptionUsageBasedTierRelations = relations(SubscriptionUsageBasedTier, ({ one }) => ({
  subscriptionUsageBasedPrice: one(SubscriptionUsageBasedPrice, {
    fields: [SubscriptionUsageBasedTier.subscriptionUsageBasedPriceId],
    references: [SubscriptionUsageBasedPrice.id],
  }),
}));

export const SubscriptionFeatureRelations = relations(SubscriptionFeature, ({ one }) => ({
  subscriptionProduct: one(SubscriptionProduct, {
    fields: [SubscriptionFeature.subscriptionProductId],
    references: [SubscriptionProduct.id],
  }),
}));

export const TenantSubscriptionProductPriceRelations = relations(TenantSubscriptionProductPrice, ({ one, many }) => ({
  tenantSubscriptionProduct: one(TenantSubscriptionProduct, {
    fields: [TenantSubscriptionProductPrice.tenantSubscriptionProductId],
    references: [TenantSubscriptionProduct.id],
  }),
  subscriptionPrice: one(SubscriptionPrice, {
    fields: [TenantSubscriptionProductPrice.subscriptionPriceId],
    references: [SubscriptionPrice.id],
  }),
  subscriptionUsageBasedPrice: one(SubscriptionUsageBasedPrice, {
    fields: [TenantSubscriptionProductPrice.subscriptionUsageBasedPriceId],
    references: [SubscriptionUsageBasedPrice.id],
  }),
  usageRecords: many(TenantSubscriptionUsageRecord),
}));

export const TenantSubscriptionUsageRecordRelations = relations(TenantSubscriptionUsageRecord, ({ one }) => ({
  tenantSubscriptionProductPrice: one(TenantSubscriptionProductPrice, {
    fields: [TenantSubscriptionUsageRecord.tenantSubscriptionProductPriceId],
    references: [TenantSubscriptionProductPrice.id],
  }),
}));

export const CreditRelations = relations(Credit, ({ one }) => ({
  tenant: one(Tenant, {
    fields: [Credit.tenantId],
    references: [Tenant.id],
  }),
  user: one(User, {
    fields: [Credit.userId],
    references: [User.id],
  }),
}));

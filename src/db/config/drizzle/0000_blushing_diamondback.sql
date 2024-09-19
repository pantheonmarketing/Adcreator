-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "TenantUser" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionPrice" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriptionProductId" text NOT NULL,
	"stripeId" text NOT NULL,
	"type" integer NOT NULL,
	"billingPeriod" integer NOT NULL,
	"price" numeric(65, 30) NOT NULL,
	"currency" text NOT NULL,
	"trialDays" integer NOT NULL,
	"active" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserRegistrationAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"email" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"slug" text,
	"token" text NOT NULL,
	"ipAddress" text,
	"company" text,
	"createdTenantId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TenantUserInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"tenantId" text NOT NULL,
	"email" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"pending" boolean NOT NULL,
	"createdUserId" text,
	"fromUserId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"avatar" text,
	"phone" text,
	"defaultTenantId" text,
	"verifyToken" text,
	"locale" text,
	"active" boolean DEFAULT false NOT NULL,
	"admin" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Permission" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"isDefault" boolean NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RolePermission" (
	"id" text PRIMARY KEY NOT NULL,
	"roleId" text NOT NULL,
	"permissionId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AppConfiguration" (
	"id" text PRIMARY KEY NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"theme" text,
	"authRequireEmailVerification" boolean DEFAULT false NOT NULL,
	"authRequireOrganization" boolean DEFAULT true NOT NULL,
	"authRequireName" boolean DEFAULT true NOT NULL,
	"analyticsSimpleAnalytics" boolean DEFAULT false NOT NULL,
	"analyticsPlausibleAnalytics" boolean DEFAULT false NOT NULL,
	"analyticsGoogleAnalyticsTrackingId" text,
	"subscriptionRequired" boolean DEFAULT true NOT NULL,
	"subscriptionAllowSubscribeBeforeSignUp" boolean DEFAULT true NOT NULL,
	"subscriptionAllowSignUpBeforeSubscribe" boolean DEFAULT true NOT NULL,
	"brandingLogo" text,
	"brandingLogoDarkMode" text,
	"brandingIcon" text,
	"brandingIconDarkMode" text,
	"brandingFavicon" text,
	"headScripts" text,
	"bodyScripts" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserRole" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" text NOT NULL,
	"roleId" text NOT NULL,
	"tenantId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Role" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"assignToNewUsers" boolean NOT NULL,
	"isDefault" boolean NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionProduct" (
	"id" text PRIMARY KEY NOT NULL,
	"stripeId" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"active" boolean NOT NULL,
	"model" integer NOT NULL,
	"public" boolean NOT NULL,
	"groupTitle" text,
	"groupDescription" text,
	"description" text,
	"badge" text,
	"billingAddressCollection" text DEFAULT 'auto' NOT NULL,
	"hasQuantity" boolean DEFAULT false NOT NULL,
	"canBuyAgain" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"subscriptionId" text,
	"active" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TenantSubscriptionProduct" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantSubscriptionId" text NOT NULL,
	"subscriptionProductId" text NOT NULL,
	"cancelledAt" timestamp(3),
	"endsAt" timestamp(3),
	"stripeSubscriptionId" text,
	"quantity" integer,
	"fromCheckoutSessionId" text,
	"currentPeriodStart" timestamp(3),
	"currentPeriodEnd" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionUsageBasedPrice" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriptionProductId" text NOT NULL,
	"stripeId" text NOT NULL,
	"billingPeriod" integer NOT NULL,
	"currency" text NOT NULL,
	"unit" text NOT NULL,
	"unitTitle" text NOT NULL,
	"unitTitlePlural" text NOT NULL,
	"usageType" text NOT NULL,
	"aggregateUsage" text NOT NULL,
	"tiersMode" text NOT NULL,
	"billingScheme" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionUsageBasedTier" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriptionUsageBasedPriceId" text NOT NULL,
	"from" integer NOT NULL,
	"to" integer,
	"perUnitPrice" numeric(65, 30),
	"flatFeePrice" numeric(65, 30)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionFeature" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriptionProductId" text NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"name" text NOT NULL,
	"type" integer NOT NULL,
	"value" integer NOT NULL,
	"href" text,
	"badge" text,
	"accumulate" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TenantSubscription" (
	"id" text PRIMARY KEY NOT NULL,
	"tenantId" text NOT NULL,
	"stripeCustomerId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TenantSubscriptionProductPrice" (
	"id" text PRIMARY KEY NOT NULL,
	"tenantSubscriptionProductId" text NOT NULL,
	"subscriptionPriceId" text,
	"subscriptionUsageBasedPriceId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TenantSubscriptionUsageRecord" (
	"id" text PRIMARY KEY NOT NULL,
	"tenantSubscriptionProductPriceId" text NOT NULL,
	"timestamp" integer NOT NULL,
	"quantity" integer NOT NULL,
	"stripeSubscriptionItemId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Credit" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" text NOT NULL,
	"userId" text,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"objectId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CheckoutSessionStatus" (
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"id" text NOT NULL,
	"pending" boolean DEFAULT true NOT NULL,
	"email" text NOT NULL,
	"fromUrl" text NOT NULL,
	"fromUserId" text,
	"fromTenantId" text,
	"createdUserId" text,
	"createdTenantId" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantUser" ADD CONSTRAINT "TenantUser_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantUser" ADD CONSTRAINT "TenantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubscriptionPrice" ADD CONSTRAINT "SubscriptionPrice_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "public"."SubscriptionProduct"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRegistrationAttempt" ADD CONSTRAINT "UserRegistrationAttempt_createdTenantId_fkey" FOREIGN KEY ("createdTenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantUserInvitation" ADD CONSTRAINT "TenantUserInvitation_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantUserInvitation" ADD CONSTRAINT "TenantUserInvitation_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantUserInvitation" ADD CONSTRAINT "TenantUserInvitation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionProduct" ADD CONSTRAINT "TenantSubscriptionProduct_tenantSubscriptionId_fkey" FOREIGN KEY ("tenantSubscriptionId") REFERENCES "public"."TenantSubscription"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionProduct" ADD CONSTRAINT "TenantSubscriptionProduct_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "public"."SubscriptionProduct"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubscriptionUsageBasedPrice" ADD CONSTRAINT "SubscriptionUsageBasedPrice_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "public"."SubscriptionProduct"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubscriptionUsageBasedTier" ADD CONSTRAINT "SubscriptionUsageBasedTier_subscriptionUsageBasedPriceId_fkey" FOREIGN KEY ("subscriptionUsageBasedPriceId") REFERENCES "public"."SubscriptionUsageBasedPrice"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SubscriptionFeature" ADD CONSTRAINT "SubscriptionFeature_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "public"."SubscriptionProduct"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscription" ADD CONSTRAINT "TenantSubscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionProductPrice" ADD CONSTRAINT "TenantSubscriptionProductPrice_tenantSubscriptionProductId_fkey" FOREIGN KEY ("tenantSubscriptionProductId") REFERENCES "public"."TenantSubscriptionProduct"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionProductPrice" ADD CONSTRAINT "TenantSubscriptionProductPrice_subscriptionPriceId_fkey" FOREIGN KEY ("subscriptionPriceId") REFERENCES "public"."SubscriptionPrice"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionProductPrice" ADD CONSTRAINT "TenantSubscriptionProductPrice_subscriptionUsageBasedPrice_fkey" FOREIGN KEY ("subscriptionUsageBasedPriceId") REFERENCES "public"."SubscriptionUsageBasedPrice"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TenantSubscriptionUsageRecord" ADD CONSTRAINT "TenantSubscriptionUsageRecord_tenantSubscriptionProductPri_fkey" FOREIGN KEY ("tenantSubscriptionProductPriceId") REFERENCES "public"."TenantSubscriptionProductPrice"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Credit" ADD CONSTRAINT "Credit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Credit" ADD CONSTRAINT "Credit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TenantUser_tenantId_userId_key" ON "TenantUser" USING btree ("tenantId" text_ops,"userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserRegistrationAttempt_createdTenantId_key" ON "UserRegistrationAttempt" USING btree ("createdTenantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserRegistrationAttempt_email_key" ON "UserRegistrationAttempt" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserRegistrationAttempt_token_key" ON "UserRegistrationAttempt" USING btree ("token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TenantUserInvitation_createdUserId_key" ON "TenantUserInvitation" USING btree ("createdUserId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Permission_name_key" ON "Permission" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Tenant_slug_idx" ON "Tenant" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_slug_key" ON "Tenant" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TenantSubscription_tenantId_key" ON "TenantSubscription" USING btree ("tenantId" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Credit_tenantId_createdAt_idx" ON "Credit" USING btree ("tenantId" timestamp_ops,"createdAt" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Credit_tenantId_userId_idx" ON "Credit" USING btree ("tenantId" text_ops,"userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "CheckoutSessionStatus_id_key" ON "CheckoutSessionStatus" USING btree ("id" text_ops);
*/
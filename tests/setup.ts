import { beforeAll, beforeEach } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "@/db/config/prisma/database";
import { promiseHash } from "@/lib/utils";

const execAsync = promisify(exec);

function setTestDatabase() {
  if (!process.env.DATABASE_URL_TEST) {
    throw new Error("DATABASE_URL_TEST is not defined. Please define it in .env.test");
  }
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
}

beforeAll(async () => {
  setTestDatabase();

  try {
    // Push the Prisma schema to the test database
    await execAsync("npx prisma db push --accept-data-loss");
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Failed to push the Prisma schema: " + e.message);
  }

  await execAsync("npx prisma db push");
});

beforeEach(async () => {
  await promiseHash({
    appConfiguration: prisma.appConfiguration.deleteMany(),
    users: prisma.user.deleteMany(),
    userRegistrationAttempt: prisma.userRegistrationAttempt.deleteMany(),
    tenant: prisma.tenant.deleteMany(),
    tenantUser: prisma.tenantUser.deleteMany(),
    tenantUserInvitation: prisma.tenantUserInvitation.deleteMany(),
    tenantSubscription: prisma.tenantSubscription.deleteMany(),
    tenantSubscriptionProduct: prisma.tenantSubscriptionProduct.deleteMany(),
    tenantSubscriptionProductPrice: prisma.tenantSubscriptionProductPrice.deleteMany(),
    subscriptionProduct: prisma.subscriptionProduct.deleteMany(),
    subscriptionFeature: prisma.subscriptionFeature.deleteMany(),
    subscriptionPrice: prisma.subscriptionPrice.deleteMany(),
    role: prisma.role.deleteMany(),
    userRole: prisma.userRole.deleteMany(),
    permission: prisma.permission.deleteMany(),
    rolePermission: prisma.rolePermission.deleteMany(),
    checkoutSessionStatus: prisma.checkoutSessionStatus.deleteMany(),
  });
});

// beforeEach(async () => {
//   // TRUNCATE all tables in the test database
//   setTestDatabase();
//   try {
//     const prisma = new PrismaClient({
//       datasourceUrl: process.env.DATABASE_URL_TEST,
//     });
//     await prisma.$connect();
//     const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

//     const tables = tablenames
//       .map(({ tablename }) => tablename)
//       .filter((name) => name !== "_prisma_migrations")
//       .map((name) => `"public"."${name}"`)
//       .join(", ");

//     try {
//       await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
//     } catch (e: any) {
//       // eslint-disable-next-line no-console
//       console.error("Failed to truncate tables: " + e.message);
//     }
//     // await execAsync("npx prisma migrate reset --force");
//   } catch (e: any) {
//     throw Error("Failed to reset the database: " + e.message.substring(0, 100) + "...");
//   }
// });

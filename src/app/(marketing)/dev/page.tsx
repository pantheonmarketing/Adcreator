"use server";

import { getUserInfo, resetUserSession } from "@/lib/services/session.server";
import { getUser } from "@/modules/accounts/services/UserService";
import { cache, getCachedValues } from "@/lib/services/cache.server";
import SeedService from "@/modules/core/services/SeedService";
import { db } from "@/db";
import DevComponent from "./component";
import { actionLogin } from "@/modules/accounts/services/AuthService";

async function load() {
  const userInfo = getUserInfo();
  const user = await getUser(userInfo.userId || "");
  if (process.env.NODE_ENV !== "development" && !user?.admin) {
    // return json({ error: "This route is only available in development" }, { status: 404 });
    throw new Error("This route is only available in development");
  }
  const cachedValues = getCachedValues();
  const users = await db.user.count();
  return {
    cachedValues,
    databaseState: {
      alreadySeeded: users > 0,
      users,
      tenants: await db.tenant.count(),
    },
  };
}

export default async function DevRoute() {
  const data = await load();
  return <DevComponent data={data} />;
}

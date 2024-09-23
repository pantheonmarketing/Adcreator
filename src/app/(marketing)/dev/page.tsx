"use server";

import { getUserInfo, resetUserSession } from "@/lib/services/session.server";
import { getUser } from "@/modules/accounts/services/UserService";
import { getCachedValues } from "@/lib/services/cache.server";
import { db } from "@/db";
import DevComponent from "./component";

const loader = async () => {
  const userInfo = getUserInfo();
  const user = await getUser(userInfo.userId || "");
  if (process.env.NODE_ENV !== "development" && !user?.admin) {
    // return json({ error: "This route is only available in development" }, { status: 404 });
    throw new Error("This route is only available in development");
  }
  const cachedValues = await getCachedValues();
  const users = await db.user.count();
  return {
    cachedValues,
    databaseState: {
      alreadySeeded: users > 0,
      users,
      tenants: await db.tenant.count(),
    },
  };
};

export default async function DevRoute() {
  const data = await loader();
  return <DevComponent data={data} />;
}

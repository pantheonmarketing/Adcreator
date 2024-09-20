"use server";

import {  clearAllCache, getCachedValues } from "@/lib/services/cache.server";
import { resetUserSession } from "@/lib/services/session.server";
import { actionLogin } from "@/modules/accounts/services/AuthService";
import SeedService from "@/modules/core/services/SeedService";
import { revalidatePath } from "next/cache";

export const actionDev = async (prev: any, form: FormData) => {
  const action = form.get("action")?.toString();
  if (action === "clearCache") {
    const cachedValues = await getCachedValues();
    const keyCount = cachedValues.length;
    await clearAllCache();
    revalidatePath("/dev");
    // return json({ success: `Cleared ${keyCount} keys from cache: ${cachedValues.map((cv) => cv.key).join(", ")}` });
    return { success: `Cleared ${keyCount} keys from cache: ${cachedValues.map((cv) => cv.key).join(", ")}` };
  } else if (action === "seed") {
    try {
      await SeedService.seed();
      // return json({ success: "Seeded database" });
      return { success: "Seeded database" };
    } catch (e: any) {
      return { error: e.message };
    }
  } else if (action === "logout") {
    resetUserSession();
    return { success: "Logged out" };
  } else if (action === "login") {
    const form = new FormData();
    form.set("email", "admin@email.com");
    form.set("password", "password");
    form.set("redirectTo", "/dev");
    return actionLogin(null, form);
    // return { success: "Logged in" };
  }
};

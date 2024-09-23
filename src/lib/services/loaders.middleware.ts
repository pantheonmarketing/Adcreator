import { headers } from "next/headers";
import { getUserInfo } from "./session.server";
import { db } from "@/db";
import { getTenantIdFromUrl } from "@/modules/accounts/services/TenantService";
import { getCurrentUrl, requireTenantSlug } from "./url.server";

export async function requireAuth() {
  // const heads = headers();
  // const currentUrl = heads.get("x-url")?.toLowerCase() || "/";
  // const currentUrl = getCurrentUrl();
  const url = new URL(getCurrentUrl());
  const currentPath = url.pathname;
  if (currentPath.startsWith("/admin")) {
    console.log("[requireAuth.admin]", currentPath);
    return await requireAdmin();
  } else if ((currentPath.startsWith("/app") && currentPath !== "/app") || (currentPath.startsWith("/subscribe") && currentPath !== "/subscribe")) {
    console.log("[requireAuth.app]", currentPath);
    const userInfo = getUserInfo();
    const tenantSlug = requireTenantSlug();
    const tenantId = await getTenantIdFromUrl(tenantSlug);
    if (!userInfo.userId || !tenantId) {
      throw new Error("Unauthorized");
    }
    const member = await db.tenantUser.get(userInfo.userId, tenantId);
    if (!member) {
      const user = await db.user.get(userInfo.userId);
      if (!user?.admin) {
        throw new Error("Unauthorized");
      }
    }
  } else {
    console.log("[requireAuth.none]", currentPath);
  }
}

async function requireAdmin() {
  const userInfo = getUserInfo();
  if (!userInfo.userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.get(userInfo.userId);
  if (!user?.admin) {
    throw new Error("Unauthorized");
  }
}

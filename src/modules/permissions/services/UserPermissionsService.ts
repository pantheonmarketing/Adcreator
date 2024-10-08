import { db } from "@/db";
import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
import { getUserInfo } from "@/lib/services/session.server";

export async function verifyUserHasPermission(permissionName: DefaultPermission, tenantId: string | null = null) {
  const userInfo = getUserInfo();
  if (!userInfo.userId) {
    throw Error("Unauthorized");
  }
  const permission = await db.permission.getByName(permissionName);
  if (permission) {
    const userPermission = (await db.userRole.countPermissionByUser(userInfo.userId, tenantId, permissionName)) > 0;
    if (!userPermission) {
      throw Error("Unauthorized");
    }
  }
  return true;
}

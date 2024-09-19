import { db } from "@/db";
import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
import { getUserInfo } from "@/lib/services/session.server";

export async function verifyUserHasPermission(request: Request, permissionName: DefaultPermission, tenantId: string | null = null) {
  if (permissionName.startsWith("entity.")) {
    return true;
  }
  const userInfo = await getUserInfo(request);
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

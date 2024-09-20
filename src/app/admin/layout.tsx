import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
import { getUserInfo } from "@/lib/services/session.server";
import { AdminDataDto } from "@/lib/state/useAdminData";
import { promiseHash } from "@/lib/utils";
import { getUser } from "@/modules/accounts/services/UserService";
import { AdminRoleEnum } from "@/modules/permissions/enums/AdminRoleEnum";
import { getPermissionsByUser, getUserRoleInAdmin } from "@/modules/permissions/services/UserRolesService";
import SidebarLayout from "@/components/layouts/SidebarLayout";
import AdminDataLayout from "@/context/AdminDataLayout";
import { redirect } from "next/navigation";
import { ServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";

export async function load({ params }: ServerComponentsProps): Promise<AdminDataDto> {
  const userInfo = getUserInfo();
  const user = userInfo.userId ? await getUser(userInfo.userId) : null;
  if (!userInfo || !user || !userInfo.userId) {
    redirect(`/login`);
  }

  if (!user.admin) {
    throw new Error("Only admins can access this page");
    // throw json({ error: "Only admins can access this page" }, { status: 401 });
  }

  const { allPermissions, superAdminRole } = await promiseHash({
    allPermissions: getPermissionsByUser(userInfo.userId, null),
    superAdminRole: getUserRoleInAdmin(userInfo.userId, AdminRoleEnum.SuperAdmin),
  });
  const data: AdminDataDto = {
    user,
    permissions: allPermissions.map((f) => f as DefaultPermission),
    isSuperUser: !!superAdminRole,
    isSuperAdmin: !!superAdminRole,
  };
  return data;
}

export default async function ({ children, params }: { children: React.ReactNode; params: { [key: string]: string } }) {
  const adminData = await load({ params });
  return (
    <AdminDataLayout data={adminData}>
      <SidebarLayout layout="admin">{children}</SidebarLayout>
    </AdminDataLayout>
  );
}

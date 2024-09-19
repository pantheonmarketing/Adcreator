// import { useEffect } from "react";
// import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
// import { Outlet, useLocation, useNavigate } from "@remix-run/react";
// import AppLayout from "@/components/app/AppLayout";
// import UrlUtils from "@/lib/utils/UrlUtils";
// import ServerError from "@/components/errors/ServerError";
// import { getTranslations } from "@/locale/i18next.server";
// import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
// import { db } from "@/db";
// import { getUserInfo } from "@/lib/services/session.server";
// import { AdminLoaderData } from "@/lib/state/useAdminData";
// import { promiseHash } from "@/lib/utils";
// import { getUser } from "@/modules/accounts/services/UserService";
// import { AdminRoleEnum } from "@/modules/permissions/enums/AdminRoleEnum";
// import { getAllRolesWithoutPermissions } from "@/modules/permissions/services/RolesService";
// import { getPermissionsByUser, getUserRoleInAdmin } from "@/modules/permissions/services/UserRolesService";

// export const loader = async ({ request, params }: LoaderFunctionArgs) => {
//   const { t } = await getTranslations(request);
//   const userInfo = await getUserInfo(request);
//   const url = new URL(request.url);
//   if (UrlUtils.stripTrailingSlash(url.pathname) === `/admin`) {
//     throw redirect(`/admin/dashboard`);
//   }
//   const user = await getUser(userInfo?.userId);
//   const redirectTo = url.pathname + url.search;
//   if (!userInfo || !user) {
//     let searchParams = new URLSearchParams([["redirect", redirectTo]]);
//     throw redirect(`/login?${searchParams}`);
//   }

//   if (!user.admin) {
//     throw json({ error: "Only admins can access this page" }, { status: 401 });
//   }

//   const myTenants = await db.tenant.getByUser(user.id);

//   const { allPermissions, superAdminRole, allRoles } = await promiseHash({
//     allPermissions: getPermissionsByUser(userInfo.userId, null),
//     superAdminRole: getUserRoleInAdmin(userInfo.userId, AdminRoleEnum.SuperAdmin),
//     allRoles: getAllRolesWithoutPermissions("admin"),
//   });
//   const data: AdminLoaderData = {
//     user,
//     myTenants,
//     currentTenant: null,
//     // roles,
//     allRoles,
//     permissions: allPermissions.map((f) => f as DefaultPermission),
//     isSuperUser: !!superAdminRole,
//     isSuperAdmin: !!superAdminRole,
//   };
//   return json(data);
// };

// export default function AdminRoute() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     try {
//       // @ts-ignore
//       $crisp.push(["do", "chat:hide"]);
//     } catch {
//       // ignore
//     }
//   }, []);

//   useEffect(() => {
//     if (UrlUtils.stripTrailingSlash(location.pathname) === "/admin") {
//       navigate("/admin/dashboard");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.pathname]);
//   return (
//     <AppLayout layout="admin">
//       <Outlet />
//     </AppLayout>
//   );
// }

// export function ErrorBoundary() {
//   return <ServerError />;
// }

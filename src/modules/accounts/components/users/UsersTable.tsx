"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSubmit } from "@remix-run/react";
import ConfirmModal, { RefConfirmModal } from "@/components/ui/modals/ConfirmModal";
import TableSimple, { RowHeaderActionDto, RowHeaderDisplayDto } from "@/components/ui/tables/TableSimple";
import DateUtils from "@/lib/utils/DateUtils";
import UserBadge from "./UserBadge";
import { PaginationDto } from "@/lib/dtos/PaginationDto";
import { RoleModel, UserWithDetailsDto } from "@/db/models";

interface Props {
  items: UserWithDetailsDto[];
  canChangePassword: boolean;
  canSetUserRoles?: boolean;
  canDelete: boolean;
  pagination?: PaginationDto;
}
export default function UsersTable({ items, canChangePassword, canSetUserRoles, canDelete, pagination }: Props) {
  const { t } = useTranslation();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<UserWithDetailsDto>[]>([]);
  const [actions, setActions] = useState<RowHeaderActionDto<UserWithDetailsDto>[]>([]);

  useEffect(() => {
    function getUserRoles(user: UserWithDetailsDto, tenantId: string | null): RoleModel[] {
      const roles: RoleModel[] = [];
      user.roles
        .filter((f) => (tenantId ? f.tenantId === tenantId && f.role.type === "app" : f.role.type === "admin"))
        .forEach((role) => {
          if (roles.find((f) => f.name === role.role.name) === undefined) {
            roles.push(role.role);
          }
        });
      // sort by type then by order
      const sorted = roles.sort((a, b) => {
        if (a.type === b.type) {
          return a.order - b.order;
        }
        // sort by type (text)
        return a.type.localeCompare(b.type);
      });
      return sorted;
    }
    const headers: RowHeaderDisplayDto<UserWithDetailsDto>[] = [
      {
        name: "user",
        title: t("models.user.object"),
        // value: (i) => i.email,
        value: (item) => <UserBadge item={item} admin={item.admin} withAvatar={true} withSignUpMethod={true} />,
        sortBy: "email",
      },
      {
        name: "tenants",
        title: t("app.users.accountsAndRoles"),
        value: (i) => (
          <div className="max-w-sm truncate">
            <div
              className="truncate italic text-gray-500"
              title={getUserRoles(i, null)
                .map((x) => x.name)
                .join(", ")}
            >
              {getUserRoles(i, null)
                .map((x) => x.name)
                .join(", ")}
            </div>
            {i.tenants.map((f) => {
              return (
                <div key={f.id} className="truncate">
                  <Link
                    to={"/app/" + f.tenant.slug}
                    className="border-b border-dashed border-transparent hover:border-dashed hover:border-gray-400 focus:bg-gray-100"
                  >
                    <span>{f.tenant.name}</span>
                  </Link>{" "}
                  {getUserRoles(i, f.tenantId).length > 0 ? (
                    <span
                      className="truncate text-xs italic text-gray-500"
                      title={getUserRoles(i, f.tenantId)
                        .map((x) => x.name)
                        .join(", ")}
                    >
                      (
                      {getUserRoles(i, f.tenantId)
                        .map((x) => x.name)
                        .join(", ")}
                      )
                    </span>
                  ) : (
                    <span className="truncate text-xs italic text-red-500">({t("app.users.undefinedRoles")})</span>
                  )}
                </div>
              );
            })}
          </div>
        ),
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        // value: (i) => DateUtils.dateDM(i.createdAt),
        value: (item) => (
          <time dateTime={DateUtils.dateYMDHMS(item.createdAt)} title={DateUtils.dateYMDHMS(item.createdAt)}>
            {DateUtils.dateAgo(item.createdAt)}
          </time>
        ),
        sortBy: "createdAt",
      },
    ];

    const actions: RowHeaderActionDto<UserWithDetailsDto>[] = [];
    if (canChangePassword) {
      actions.push({
        title: t("settings.profile.changePassword"),
        onClick: (_, item) => changePassword(item),
        disabled: (_) => !canChangePassword,
      });
    }
    if (canSetUserRoles) {
      actions.push({
        title: t("admin.users.setAdminRoles"),
        onClickRoute: (_, item) => `/admin/accounts/users/${item.email}/roles`,
      });
    }
    if (canDelete) {
      actions.push({
        title: t("shared.delete"),
        onClick: (_, item) => deleteUser(item),
        disabled: (_) => !canDelete,
        destructive: true,
      });
    }

    setActions(actions);
    setHeaders(headers);
  }, [items, t]);

  function changePassword(user: UserWithDetailsDto) {
    const password = prompt(t("settings.profile.changePassword") + " - " + user.email);
    if (password && confirm("[ADMINISTRATOR] Update password for user " + user.email + "?")) {
      const form = new FormData();
      form.set("action", "change-password");
      form.set("user-id", user.id);
      form.set("password-new", password);
      submit(form, {
        action: "/admin/accounts/users",
        method: "post",
      });
    }
  }
  function deleteUser(item: UserWithDetailsDto) {
    if (confirmDelete.current) {
      confirmDelete.current.setValue(item);
      confirmDelete.current.show(t("shared.delete"), t("shared.delete"), t("shared.cancel"), t("admin.users.deleteWarning"));
    }
  }
  function confirmDeleteUser(item: { id: string }) {
    const form = new FormData();
    form.set("action", "delete-user");
    form.set("user-id", item.id);
    submit(form, {
      action: "/admin/accounts/users",
      method: "post",
    });
  }

  return (
    <div>
      <TableSimple items={items} headers={headers} actions={actions} pagination={pagination} />
      <ConfirmModal ref={confirmDelete} onYes={confirmDeleteUser} destructive />
    </div>
  );
}

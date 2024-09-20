"use client";

import { useTranslation } from "react-i18next";
import InputCheckboxWithDescription from "@/components/ui/input/InputCheckboxWithDescription";
import { useEffect, useState } from "react";
import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary";
import RoleBadge from "./RoleBadge";
import InputRadioGroup from "@/components/ui/input/InputRadioGroup";
import InputSearch from "@/components/ui/input/InputSearch";
import { PermissionWithRolesDto, RoleWithPermissionsDto } from "@/db/models";
import { Input } from "@/components/ui/input";
import { Form, useSubmit } from "@remix-run/react";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary";
import LoadingButton from "@/components/ui/buttons/LoadingButton";

interface Props {
  item?: PermissionWithRolesDto;
  roles: RoleWithPermissionsDto[];
  onCancel: () => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export default function PermissionForm({ item, roles, onCancel, canUpdate = true, canDelete }: Props) {
  const { t } = useTranslation();
  const submit = useSubmit();

  const [permissionRoles, setRoles] = useState<string[]>([]);
  const [type, setType] = useState<string | number | undefined>(item?.type ?? "admin");

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setRoles([]);
  }, [type]);

  useEffect(() => {
    const permissionRoles: string[] = [];
    if (item) {
      item?.inRoles.forEach((item) => {
        permissionRoles.push(item.role.name);
      });
    }
    setRoles(permissionRoles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hasRole(role: RoleWithPermissionsDto) {
    return permissionRoles.includes(role.name);
  }

  function setPermission(role: RoleWithPermissionsDto, add: any) {
    if (add) {
      setRoles([...permissionRoles, role.name]);
    } else {
      setRoles(permissionRoles.filter((f) => f !== role.name));
    }
  }

  const filteredItems = () => {
    if (!roles.filter((f) => f.type === type)) {
      return [];
    }
    return roles
      .filter((f) => f.type === type)
      .filter(
        (f) =>
          f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) || f.description?.toString().toUpperCase().includes(searchInput.toUpperCase())
      );
  };

  function onDelete() {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", item?.id || "");
    submit(form, {
      method: "post",
    });
  }

  return (
    <Form method="post" className="space-y-3 px-4 pb-4">
      <input type="hidden" name="action" value={item ? "edit" : "create"} readOnly hidden />
      <div className="text-lg font-bold text-gray-900">Permission Details</div>

      <div className="space-y-1">
        <label className="text-xs font-medium">
          {t("models.role.name")} <span className="text-red-500">*</span>
        </label>
        <Input disabled={!canUpdate} required name="name" title={t("models.role.name")} defaultValue={item?.name} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">
          {t("models.role.description")} <span className="text-red-500">*</span>
        </label>
        <Input disabled={!canUpdate} required name="description" title={t("models.role.description")} defaultValue={item?.description} />
      </div>
      <InputRadioGroup
        disabled={!canUpdate}
        name="type"
        title={t("models.permission.type")}
        value={type}
        onChange={setType}
        options={[
          {
            name: "Admin Permission",
            value: "admin",
          },
          {
            name: "App Permission",
            value: "app",
          },
        ]}
      />

      <div>
        <label className="flex justify-between space-x-2 truncate text-xs font-medium text-gray-600">
          <div className="flex items-center justify-between space-x-1">
            <div className="text-lg font-bold text-gray-900">{t("models.role.plural")}</div>
          </div>
          <div>
            {filteredItems().length === permissionRoles.length ? (
              <ButtonTertiary disabled={!canUpdate} onClick={() => setRoles([])}>
                {t("shared.clear")}
              </ButtonTertiary>
            ) : (
              <ButtonTertiary disabled={!canUpdate} onClick={() => setRoles(filteredItems().map((f) => f.name))}>
                {t("shared.selectAll")}
              </ButtonTertiary>
            )}
          </div>
        </label>
        <InputSearch value={searchInput} onChange={setSearchInput} />
        <div className="mt-1">
          {permissionRoles.map((role) => {
            return <input key={role} type="hidden" name="roles[]" value={role} />;
          })}
          {filteredItems().map((role, idx) => {
            return (
              <InputCheckboxWithDescription
                disabled={!canUpdate}
                name={role.order + " " + role.name}
                title={<RoleBadge item={role} />}
                description={role.description}
                defaultValue={hasRole(role)}
                // value={hasRole(role)}
                onChange={(e) => setPermission(role, e)}
                key={idx}
              />
            );
          })}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-border px-4 py-2 sm:px-6"></div>

      <div className="flex justify-between space-x-2">
        <div>
          {item && canDelete && (
            <ButtonSecondary type="button" onClick={onDelete}>
              {t("shared.delete")}
            </ButtonSecondary>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <ButtonSecondary type="button" onClick={onCancel}>
            {t("shared.cancel")}
          </ButtonSecondary>
          <LoadingButton type="submit">{t("shared.save")}</LoadingButton>
        </div>
      </div>
    </Form>
  );
}

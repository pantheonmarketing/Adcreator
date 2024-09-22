"use client";

import { useTranslation } from "react-i18next";
import { actionAdminUsers, AdminUsersLoaderData } from "./page";
import { useActionState, useEffect } from "react";
import useAdminData from "@/lib/state/useAdminData";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import IndexPageLayout from "@/components/ui/layouts/IndexPageLayout";
import InputFilters from "@/components/ui/input/InputFilters";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import UsersTable from "@/modules/accounts/components/users/UsersTable";
import SlideOverWideEmpty from "@/components/ui/slideOvers/SlideOverWideEmpty";

export default function ({ data, children }: { data: AdminUsersLoaderData; children: React.ReactNode }) {
  const { t } = useTranslation();
  const [actionData, action, pending] = useActionState(actionAdminUsers, null);
  const adminData = useAdminData();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <IndexPageLayout
      title={t("models.user.plural")}
      buttons={
        <>
          <InputFilters filters={data.filterableProperties} />
          <ButtonPrimary to="new">{t("shared.new")}</ButtonPrimary>
        </>
      }
    >
      <UsersTable
        items={data.items}
        canChangePassword={true}
        canDelete={true}
        canSetUserRoles={adminData.isSuperAdmin}
        pagination={data.pagination}
        serverAction={{ actionData, action, pending }}
      />

      <SlideOverWideEmpty
        open={!!children}
        onClose={() => {
          // navigate(".", { replace: true });
          router.replace(pathname);
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{children}</div>
        </div>
      </SlideOverWideEmpty>
    </IndexPageLayout>
  );
}

"use client";

import { UserDto, TenantDto } from "@/db/models";
import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
import { PlanFeatureUsageDto } from "@/modules/subscriptions/dtos/PlanFeatureUsageDto";
import { createContext, useContext } from "react";

export type AppOrAdminData = {
  user: UserDto;
  myTenants: TenantDto[];
  currentTenant: TenantDto | null;
  allRoles: { id: string; name: string; description: string }[];
  permissions: DefaultPermission[];
  isSuperUser: boolean;
  isSuperAdmin: boolean;
  credits?: PlanFeatureUsageDto | undefined;
};

const AppOrAdminDataContext = createContext<AppOrAdminData | null>(null);

export function useAppOrAdminData(): AppOrAdminData {
  const context = useContext(AppOrAdminDataContext);
  if (!context) {
    throw new Error("useAppOrAdminData must be used within a RootDataProvider");
  }
  return context;
}

export default AppOrAdminDataContext;

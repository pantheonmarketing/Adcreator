"use client";

import { UserDto, TenantDto, TenantSubscriptionWithDetailsDto } from "@/db/models";
import { DefaultPermission } from "@/modules/permissions/data/DefaultPermission";
import { PlanFeatureUsageDto } from "@/modules/subscriptions/dtos/PlanFeatureUsageDto";
import { createContext, useContext } from "react";

export type AppDataDto = {
  user: UserDto;
  myTenants: TenantDto[];
  currentTenant: TenantDto;
  permissions: DefaultPermission[];
  isSuperUser: boolean;
  isSuperAdmin: boolean;
  credits?: PlanFeatureUsageDto | undefined;
  mySubscription: TenantSubscriptionWithDetailsDto | null;
};

const AppDataContext = createContext<AppDataDto | null>(null);

export function useAppData(): AppDataDto {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within a AppDataContext.Provider");
  }
  return context;
}

export default AppDataContext;

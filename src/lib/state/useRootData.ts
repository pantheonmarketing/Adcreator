// src/context/RootDataContext.tsx

"use client";

import { UserDto, TenantDto } from "@/db/models";
import { MetaTagsDto } from "@/lib/dtos/MetaTagsDto";
import { UserSessionDto } from "@/lib/services/session.server";
import { AppConfigurationDto } from "@/modules/core/dtos/AppConfigurationDto";
import { createContext, useContext } from "react";

export type AppRootData = {
  metatags: MetaTagsDto;
  user: UserDto | null;
  currentTenant: TenantDto | null;
  theme: { color: string; scheme: string };
  locale: string;
  serverUrl: string;
  domainName: string;
  userSession: UserSessionDto;
  authenticated: boolean;
  debug: boolean;
  isStripeTest: boolean;
  chatWebsiteId?: string;
  appConfiguration: AppConfigurationDto;
  csrf?: string;
};

const RootDataContext = createContext<AppRootData | null>(null);

export function useRootData(): AppRootData {
  const context = useContext(RootDataContext);
  if (!context) {
    throw new Error("useRootData must be used within a RootDataProvider");
  }
  return context;
}

export default RootDataContext;

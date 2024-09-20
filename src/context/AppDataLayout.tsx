"use client";

import { AppDataContext, AppDataDto } from "@/lib/state/useAppData";

export default function AppDataLayout({ children, data }: { children: React.ReactNode; data: AppDataDto }) {
  return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>;
}

"use client";

import { RootDataContext, RootDataDto } from "../lib/state/useRootData";

export default function RootDataLayout({ children, data }: { children: React.ReactNode; data: RootDataDto }) {
  return <RootDataContext.Provider value={data}>{children}</RootDataContext.Provider>;
}

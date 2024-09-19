"use client";

import RootDataContext from "../lib/state/useRootData";

export default function RootDataLayout({ children, data }: { children: React.ReactNode; data: any }) {
  return <RootDataContext.Provider value={data}>{children}</RootDataContext.Provider>;
}

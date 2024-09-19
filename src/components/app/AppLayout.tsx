import { ReactNode } from "react";
import SidebarLayout from "../layouts/SidebarLayout";

interface Props {
  layout: "app" | "admin";
  children: ReactNode;
}

export default function AppLayout({ layout, children }: Props) {
  return (
    <div>
      <SidebarLayout layout={layout}>{children}</SidebarLayout>
    </div>
  );
}

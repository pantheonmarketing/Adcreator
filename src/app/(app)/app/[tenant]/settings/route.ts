import { requireTenantSlug } from "@/lib/services/url.server";
import { redirect } from "next/navigation";

export async function GET() {
  const tenantSlug = requireTenantSlug();
  redirect(`/app/${tenantSlug}/settings/profile`);
}

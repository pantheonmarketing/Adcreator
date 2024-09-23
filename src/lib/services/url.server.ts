"server-only";

import { headers } from "next/headers";

export const getBaseURL = () => {
  const url = headers().get("x-forwarded-host");
  if (url) {
    let protocol = headers().get("x-forwarded-proto") || "http";
    return `${protocol}://${url}`;
  }

  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export const getDomainName = () => {
  const url = new URL(getBaseURL());
  return url.host;
};

export const getCurrentUrl = () => {
  const heads = headers();
  return heads.get("x-url")?.toLowerCase() || "/";
};

export const requireTenantSlug = () => {
  const heads = headers();
  const id = heads.get("x-tenant-slug");
  if (!id) {
    throw new Error("Tenant ID not found");
  }
  return id;
};

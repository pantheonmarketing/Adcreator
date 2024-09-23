import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  let tenantSlug = "";
  // grab tenant param like /app/:tenant/ or /app/:tenant o /app/:tenant/dashboard or /app/:tenant/... etc
  const tenantMatch = request.url.match(/\/app\/([^/]+)/);
  if (tenantMatch) {
    tenantSlug = tenantMatch[1];
  }
  requestHeaders.set("x-tenant-slug", tenantSlug);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

"use server";

import { getUserInfo, createUserSession } from "@/lib/services/session.server";
import { redirect } from "next/navigation";

export async function authenticate(prev: any, formData: FormData) {
  const userInfo = getUserInfo();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string;
  console.log("[auth.login.actions] authenticate", { email, password });
  return createUserSession(
    {
      ...userInfo,
      userId: "1",
    },
    redirectTo || "/"
  );
  // return redirect(redirectTo || "/");
}

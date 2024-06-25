"use server";

import { getUserInfo, setUserSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(formData: FormData) {
  try {
    // 5 seconds delay to simulate network latency
    const userInfo = getUserInfo();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;
    console.log({
      email,
      password,
    });
    setUserSession({
      ...userInfo,
      userId: "1",
    });
    return redirect(redirectTo || "/");
  } catch (e: any) {
    console.error("[login] error:", e);
    throw e;
  }
}

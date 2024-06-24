"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(formData: FormData) {
  try {
    // 5 seconds delay to simulate network latency
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = formData.get("redirectTo") as string;
    console.log({
      email,
      password,
    });
    const cookieStore = cookies();
    cookieStore.set("user", email);
    return redirect(redirectTo || "/");
  } catch (error: any) {
    console.error("[login] error:", error);
    throw error;
  }
}

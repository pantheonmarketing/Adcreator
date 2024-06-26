"use server";

import { getUserInfo, setUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function toggleScheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const userInfo = getUserInfo();
  userInfo.scheme = userInfo.scheme === "light" ? "dark" : "light";
  console.log({
    scheme: userInfo.scheme,
  });
  setUserSession(userInfo);
  return redirect(redirectTo || "/");
}

export async function setTheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const userInfo = getUserInfo();
  setUserSession({
    ...userInfo,
    theme: formData.get("theme") as string,
  });
  return redirect(redirectTo || "/");
}

export async function logout(formData: FormData) {
  console.log("logout");
  const userInfo = getUserInfo();
  setUserSession({
    ...userInfo,
    userId: null,
  });
  return redirect("/");
}

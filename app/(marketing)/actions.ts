"use server";

import { getUserInfo, setUserSession, resetUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function toggleLightOrDarkMode(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const userInfo = getUserInfo();
  userInfo.lightOrDarkMode = userInfo.lightOrDarkMode === "light" ? "dark" : "light";
  console.log({
    lightOrDarkMode: userInfo.lightOrDarkMode,
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
  resetUserSession();
  return redirect("/");
}

"use server";

import { Theme, getThemeFromCookies, setThemeCookie } from "@/lib/theme";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function toggleTheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const cookieStore = cookies();
  const currentTheme = getThemeFromCookies(cookieStore);
  const newTheme = currentTheme === Theme.Light ? Theme.Dark : Theme.Light;

  setThemeCookie(cookieStore, newTheme);
  return redirect(redirectTo || "/");
}

export async function logout(formData: FormData) {
  console.log("logout");
  const cookieStore = cookies();
  cookieStore.delete("user");
  return redirect("/");
}

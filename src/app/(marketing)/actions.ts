"use server";

import { getUserInfo, createUserSession } from "@/lib/services/session.server";
import { redirect } from "next/navigation";

export async function actionToggleScheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const userInfo = getUserInfo();
  userInfo.scheme = userInfo.scheme === "light" ? "dark" : "light";
  console.log({
    scheme: userInfo.scheme,
  });
  return createUserSession(userInfo, redirectTo || "/");
  // return redirect(redirectTo || "/");
}

export async function actionSetTheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const userInfo = getUserInfo();
  return createUserSession(
    {
      ...userInfo,
      theme: formData.get("theme") as string,
    },
    redirectTo || "/"
  );
  // return redirect(redirectTo || "/");
}

export async function actionLogout(formData: FormData) {
  console.log("logout");
  const userInfo = getUserInfo();
  return createUserSession(
    {
      ...userInfo,
      userId: null,
    },
    "/"
  );
  // return redirect("/");
}

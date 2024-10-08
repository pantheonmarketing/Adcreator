"use server";

import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import { getUserInfo } from "@/lib/services/session.server";
import { getUser } from "@/modules/accounts/services/UserService";
import { redirect } from "next/navigation";
import Component from "./component";
import { requireAuth } from "@/lib/services/loaders.middleware";

export default async function ({}: IServerComponentsProps) {
  await requireAuth();
  const userInfo = getUserInfo();
  const user = await getUser(userInfo.userId!);
  if (process.env.NODE_ENV === "production" && !user?.admin) {
    throw redirect("/404?error=development-only");
  }
  return <Component />;
}

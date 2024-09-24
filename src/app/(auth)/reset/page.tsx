"use server";

import { getServerTranslations } from "@/i18n/server";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { db } from "@/db";
import { updateUser } from "@/modules/accounts/services/UserService";
import Component from "./component";
import AuthUtils from "@/modules/accounts/utils/AuthUtils";
import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import { createUserSession, getUserInfo } from "@/lib/services/session.server";
import bcrypt from "bcryptjs";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return getMetaTags({
    title: `${t("account.reset.title")} | ${defaultSiteTags.title}`,
  });
}

const loader = async ({ searchParams }: IServerComponentsProps) => {
  const { t } = await getServerTranslations();
  let email = searchParams?.e?.toString();
  if (email) {
    email = decodeURIComponent(email);
  }
  let verifyToken = searchParams?.t?.toString();
  if (!email || !verifyToken) {
    throw new Error("Invalid reset link");
  }
  return {
    email,
    verifyToken,
  };
};

export const actionAuthReset = async (prev: any, form: FormData) => {
  const { t } = await getServerTranslations();

  const email = form.get("email")?.toString() ?? "";
  const verifyToken = form.get("verify-token")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  const passwordConfirm = form.get("password-confirm")?.toString() ?? "";

  const fields = {
    email,
    verifyToken,
  };
  if (!email) {
    return { error: "Email required", fields };
  }
  const passwordError = AuthUtils.validatePasswords({ t, password, passwordConfirm });
  if (passwordError) {
    return { error: passwordError, fields };
  }

  const user = await db.user.getByEmail(email);
  if (!user) {
    // Do not show that the email was not found, fake wait
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: "Password reset" };
  }

  const currentVerifyToken = await db.user.getVerifyToken(user.id);
  if (!currentVerifyToken || !verifyToken || currentVerifyToken !== verifyToken) {
    return { error: "Invalid token, reset your password first", fields };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await updateUser(user.id, { passwordHash, verifyToken: "" });

  const myTenants = await db.tenant.getByUser(user.id);
  let defaultTenant = myTenants.find((t) => t.id === user.defaultTenantId);
  const userInfo = getUserInfo();
  return createUserSession(
    {
      ...userInfo,
      userId: user.id,
    },
    defaultTenant ? `/app/${defaultTenant.slug}/dashboard` : "/app"
  );
};

export default async function (props: IServerComponentsProps) {
  const data = await loader(props);
  return <Component data={data} />;
}

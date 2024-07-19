"use client";

import { getServerTranslations } from "@/i18n/server";
import { authenticate } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const [actionData, action, pending] = useActionState(authenticate, null);

  return (
    <main className="h-screen w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="mx-auto w-full space-y-4">
        <h1 className="flex justify-center space-x-2 text-2xl font-bold">{t("shared.title")}</h1>
        <div className="mx-auto mt-8 max-w-xl">
          <form action={action}>
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                {t("shared.name")}
              </label>
              <Input type="email" name="email" placeholder="Email" required />
            </div>
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                {t("shared.name")}
              </label>
              <Input type="password" name="password" placeholder="Password" required />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={pending} className={clsx(pending && "base-spinner cursor-not-allowed")}>
                {t("shared.login")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

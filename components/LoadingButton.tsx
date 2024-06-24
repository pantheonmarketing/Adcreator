"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function LoadingButton() {
  const { t } = useTranslation();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={clsx(pending && "cursor-not-allowed opacity-60")}>
      {pending ? t("shared.loading") : t("shared.submit")}
    </Button>
  );
}

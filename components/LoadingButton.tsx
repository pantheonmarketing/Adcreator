"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  children: React.ReactNode;
}
export default function LoadingButton({ children }: Props) {
  const { t } = useTranslation();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={clsx(pending && "base-spinner cursor-not-allowed")}>
      {children}
    </Button>
  );
}

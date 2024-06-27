"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../button";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}
export default function SubmitButton({ children }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={clsx(pending && "base-spinner cursor-not-allowed")}>
      {children}
    </Button>
  );
}

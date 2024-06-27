"use client";

import HoneypotInput from "@/components/ui/honeypot/HoneypotInput";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/buttons/SubmitButton";
import { ContactFormBlockDto } from "./ContactFormBlockDto";
import { ContactPage } from "@/modules/pageBlocks/pages/ContactPage";

export default function ContactFormVariantSimple({ item }: { item: ContactFormBlockDto }) {
  const { t } = useTranslation();
  const [actionData, action] = useFormState(ContactPage.actionSubmission, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <div className="mx-auto mt-12 max-w-xl">
      <form ref={formRef} action={item.data.actionUrl || action} method={item.data.actionUrl ? "POST" : undefined}>
        <input type="hidden" name="action" value="actionSubmission" readOnly hidden />
        <HoneypotInput name="_gotcha" />
        <div className="mt-9 grid grid-cols-1 gap-x-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <div className="mt-1">
              <label htmlFor="first_name" className="mb-1 text-xs font-medium">
                {t("front.contact.firstName")} <span className="text-red-500">*</span>
              </label>
              <Input title={t("front.contact.firstName")} required type="text" name="first_name" id="first_name" autoComplete="given-name" defaultValue="" />
            </div>
          </div>
          <div>
            <div className="mt-1">
              <label htmlFor="last_name" className="mb-1 text-xs font-medium">
                {t("front.contact.lastName")} <span className="text-red-500">*</span>
              </label>
              <Input title={t("front.contact.lastName")} type="text" name="last_name" id="last_name" autoComplete="family-name" defaultValue="" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="mt-1">
              <label htmlFor="email" className="mb-1 text-xs font-medium">
                {t("front.contact.email")} <span className="text-red-500">*</span>
              </label>
              <Input title={t("front.contact.email")} required id="email" name="email" type="email" autoComplete="email" defaultValue="" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="mt-1">
              <label htmlFor="comments" className="mb-1 text-xs font-medium">
                {t("front.contact.comments")} <span className="text-red-500">*</span>
              </label>
              <Textarea title={t("front.contact.comments")} required id="comments" name="comments" rows={4} defaultValue="" />
            </div>
          </div>

          <div className="text-right sm:col-span-2">
            <SubmitButton>{t("front.contact.send")}</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

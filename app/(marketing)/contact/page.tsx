"use server";

import HoneypotInput from "@/components/ui/honeypot/HoneypotInput";
import InputText from "@/components/ui/input/InputText";
import { getServerTranslations } from "@/lib/i18n/server";
import LoadingButton from "@/components/LoadingButton";
import { submission } from "./actions";

export default async function Contact() {
  const { t } = await getServerTranslations();
  const actionUrl = undefined;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <div className="relative mx-auto w-full max-w-xl overflow-hidden px-2 py-12 sm:py-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("front.contact.title")}</h1>
              <p className="text-muted-foreground mt-4 text-lg leading-6">{t("front.contact.headline")}</p>
            </div>
            <div className="mt-12">
              <form action={submission}>
                <input type="hidden" name="action" value="submission" readOnly hidden />
                <HoneypotInput name="_gotcha" />
                <ContactForm />
              </form>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ContactForm() {
  const { t } = await getServerTranslations();
  return (
    <div className="mt-9 grid grid-cols-1 gap-x-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
      <div>
        <div className="mt-1">
          <InputText title={t("front.contact.firstName")} required type="text" name="first_name" id="first_name" autoComplete="given-name" defaultValue="" />
        </div>
      </div>
      <div>
        <div className="mt-1">
          <InputText title={t("front.contact.lastName")} type="text" name="last_name" id="last_name" autoComplete="family-name" defaultValue="" />
        </div>
      </div>
      <div className="sm:col-span-2">
        <div className="mt-1">
          <InputText title={t("front.contact.email")} required id="email" name="email" type="email" autoComplete="email" defaultValue="" />
        </div>
      </div>

      <div>
        <div className="mt-1">
          <InputText title={t("front.contact.organization")} type="text" name="company" id="company" autoComplete="organization" defaultValue="" />
        </div>
      </div>

      <div>
        <div className="mt-1">
          <InputText
            title={t("front.contact.jobTitle")}
            type="text"
            name="jobTitle"
            id="organization-title"
            autoComplete="organization-title"
            defaultValue=""
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <div className="mt-1">
          <InputText title={t("front.contact.comments")} required id="comments" name="comments" rows={4} defaultValue="" />
        </div>
      </div>

      <div className="text-right sm:col-span-2">
        <LoadingButton>{t("front.contact.send")}</LoadingButton>
      </div>
    </div>
  );
}

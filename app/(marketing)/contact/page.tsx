import { useTranslation } from "react-i18next";
import ContactForm from "./ContactForm";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function Contact() {
  const { t } = await getServerTranslations();
  const actionUrl = process.env.CONTACT_FORM_URL;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <div className="relative mx-auto w-full max-w-xl overflow-hidden px-2 py-12 sm:py-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("front.contact.title")}</h1>
              <p className="mt-4 text-lg leading-6 text-muted-foreground">{t("front.contact.headline")}</p>
            </div>
            <div className="mt-12">
              <ContactForm actionUrl={actionUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

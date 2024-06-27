import { TFunction } from "i18next";
import { ContactFormBlockData } from "../blocks/marketing/contact/ContactFormBlockDto";
import { PageBlockDto } from "../blocks/PageBlockDto";
import { defaultHeader } from "../defaultBlocks/defaultHeader";
import { defaultFooter } from "../defaultBlocks/defaultFooter";

export namespace ContactPage {
  export type LoaderData = {
    contactFormData: ContactFormBlockData;
  };
  export async function load(): Promise<LoaderData> {
    return {
      contactFormData: {
        actionUrl: process.env.CONTACT_FORM_URL,
      },
    };
  }
  export async function metatags({ t }: { t: TFunction }) {
    return {
      title: t("front.contact.title"),
      description: t("front.contact.headline"),
    };
  }
  export function blocks({ data, t }: { data: LoaderData; t: TFunction }): PageBlockDto[] {
    return [
      // Header
      { header: defaultHeader({ t }) },
      {
        heading: {
          headline: t("front.contact.title"),
          subheadline: t("front.contact.headline"),
        },
      },
      // Main
      {
        contact: {
          style: "simple",
          data: data.contactFormData,
        },
      },
      // Footer
      { footer: defaultFooter({ t }) },
    ];
  }
  export async function actionSubmission(prev: any, form: FormData) {
    // fake 3 seconds delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const submission = {
      firstName: form.get("first_name")?.toString() ?? "",
      lastName: form.get("last_name")?.toString() ?? "",
      email: form.get("email")?.toString() ?? "",
      company: form.get("company")?.toString() ?? "",
      jobTitle: form.get("jobTitle")?.toString() ?? "",
      message: form.get("comments")?.toString() ?? "",
      honeypot: form.get("codeId")?.toString() ?? "",
    };
    if (submission.honeypot) {
      console.log("[Contact] SPAM detected: honeypot field filled", { submission });
      return {
        error: "An error occurred while submitting the form. Please try again later.",
      };
    }
    console.log("[Contact] New submission", { submission });

    return {
      success: "Thank you for your submission!",
    };
  }
}

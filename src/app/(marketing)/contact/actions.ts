"use server";

import { getServerTranslations } from "@/i18n/server";
import { getBaseURL } from "@/lib/services/url.server";
import { sendEmail } from "@/modules/emails/services/EmailService";

export async function actionContact(prev: any, form: FormData) {
  const { t } = await getServerTranslations();
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

  if (process.env.SUPPORT_EMAIL && process.env.POSTMARK_SERVER_TOKEN && process.env.SUPPORT_EMAIL && process.env.POSTMARK_FROM_EMAIL) {
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL,
        subject: "New contact form submission",
        body: `
                <p>
                  <b>Name</b>: ${submission.firstName} ${submission.lastName}<br/>
                  <b>Email</b>: ${submission.email}<br/>
                  ${submission.company && `<b>Company</b>: ${submission.company}<br/>`}
                  ${submission.jobTitle && `<b>Job Title</b>: ${submission.jobTitle}<br/>`}
                  <b>From site</b>: ${getBaseURL()}<br/>
                  </p>
                  <p>
                  <b>Message</b>: ${submission.message}<br/>
                </p>
                `,
        config: {
          provider: "postmark",
          from: process.env.POSTMARK_FROM_EMAIL!,
          apiKey: process.env.POSTMARK_SERVER_TOKEN!,
        },
      });
    } catch (e: any) {
      console.error("[Contact] Error sending email", e);
      return {
        error: "An error occurred while submitting the form: " + e.message,
      };
    }
  }

  return {
    success: t("front.contact.success", { 0: submission.firstName }),
  };
}

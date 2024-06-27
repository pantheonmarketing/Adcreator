import ContactForm from "./ContactForm";

export namespace ContactPage {
  export type LoaderData = {
    actionUrl?: string;
  };
  export async function load(): Promise<LoaderData> {
    return {
      actionUrl: process.env.CONTACT_FORM_URL,
    };
  }
  export async function blocks({ data }: { data: ContactPage.LoaderData }) {
    return [{ render: <ContactForm data={data} /> }];
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

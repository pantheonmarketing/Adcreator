import { sendEmailPostmark } from "./PostmarkEmailService";
import { sendEmailResend } from "./ResendEmailService";

export async function sendEmail({
  to,
  subject,
  body,
  config,
}: {
  to: string;
  subject: string;
  body: string;
  // data?: { to: string; };
  config?: {
    provider: "postmark" | "resend";
    from: string;
    apiKey: string;
  };
}) {
  const clientConfig = getConfig(config);
  if (!clientConfig) {
    // eslint-disable-next-line no-console
    console.error("📧 Email provider not configured");
    return;
  }
  // eslint-disable-next-line no-console
  console.log("📧 Sending email", { providerSettings: clientConfig.provider, to, subject });
  switch (clientConfig.provider) {
    case "postmark":
      return await sendEmailPostmark({ to, subject, body }, clientConfig.config);
    case "resend":
      return await sendEmailResend({ to, subject, body }, clientConfig.config);
    default:
      throw new Error("Invalid provider: " + clientConfig.provider);
  }
}

export function getEmailProvider() {
  const clientConfig = getConfig();
  return clientConfig?.provider;
}

function getConfig(config?: { provider: "postmark" | "resend"; from: string; apiKey: string }) {
  if (!config) {
    if (process.env.POSTMARK_SERVER_TOKEN) {
      if (!process.env.POSTMARK_FROM_EMAIL) {
        // eslint-disable-next-line no-console
        console.error("📧 POSTMARK_FROM_EMAIL required");
        return null;
      }
      config = {
        provider: "postmark",
        apiKey: process.env.POSTMARK_SERVER_TOKEN,
        from: process.env.POSTMARK_FROM_EMAIL,
      };
    } else if (process.env.RESEND_API_KEY) {
      if (!process.env.RESEND_FROM_EMAIL) {
        // eslint-disable-next-line no-console
        console.error("📧 RESEND_FROM_EMAIL required");
        return null;
      }
      config = {
        provider: "resend",
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.RESEND_FROM_EMAIL,
      };
    }
  }
  if (!config) {
    // eslint-disable-next-line no-console
    console.error("📧 POSTMARK_SERVER_TOKEN or RESEND_API_KEY required");
    return null;
  }
  return {
    provider: config.provider,
    config,
  };
}

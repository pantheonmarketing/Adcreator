export type AppConfigurationDto = {
  orm: "prisma" | "drizzle" | "mock";
  app: { name: string };
  email: {
    provider: "postmark" | "resend";
    supportEmail: string;
    senderName: string;
  };
  theme: { color: string; scheme: "light" | "dark" };
  auth: {
    requireEmailVerification: boolean;
    requireOrganization: boolean;
    requireName: boolean;
  };
  analytics: {
    simpleAnalytics: boolean;
    plausibleAnalytics: boolean;
    googleAnalyticsTrackingId?: string;
  };
  subscription: {
    required: boolean;
    allowSubscribeBeforeSignUp: boolean;
    allowSignUpBeforeSubscribe: boolean;
  };
  branding: {
    logo?: string;
    logoDarkMode?: string;
    icon?: string;
    iconDarkMode?: string;
    favicon?: string;
  };
  affiliates?: {
    provider: { rewardfulApiKey: string };
    signUpLink: string;
    percentage: number;
    plans: { title: string; price: number }[];
  };
  reviews?: {
    trustpilot?: { href: string; templateId: string; businessUnitId: string };
  };
  launches?: {
    producthunt?: { title: string; url: string; postId: string };
  };
  // portals: PortalConfiguration;
  scripts: { head: string | null; body: string | null };
};

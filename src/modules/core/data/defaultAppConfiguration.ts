import { defaultThemeColor, defaultThemeScheme } from "@/lib/themes";
import { AppConfigurationDto } from "../dtos/AppConfigurationDto";

export const defaultAppConfiguration: AppConfigurationDto = {
  app: {
    name: "Next.js RockStack Demo",
    orm: "prisma",
    cache: undefined,
  },
  email: {
    provider: "postmark",
    fromEmail: "alex@rockstack.dev",
    fromName: "Alex @ Rockstack",
    supportEmail: "rockstack.dev@gmail.com",
  },
  theme: {
    color: defaultThemeColor,
    scheme: defaultThemeScheme,
  },
  auth: {
    requireEmailVerification: false,
    requireOrganization: true,
    requireName: true,
  },
  analytics: {
    googleAnalyticsTrackingId: "",
    simpleAnalytics: true,
    plausibleAnalytics: false,
  },
  subscription: {
    required: false,
    allowSubscribeBeforeSignUp: true,
    allowSignUpBeforeSubscribe: true,
  },
  branding: {
    logo: undefined,
    logoDarkMode: undefined,
    icon: undefined,
    iconDarkMode: undefined,
    favicon: undefined,
  },
  affiliates: undefined,
  launches: undefined,
  scripts: { head: null, body: null },
};

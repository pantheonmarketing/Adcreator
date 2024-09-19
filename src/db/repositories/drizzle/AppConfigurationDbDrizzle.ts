import { drizzleDb } from "@/db/config/drizzle/database";
import { AppConfiguration } from "@/db/config/drizzle/schema";
import { AppConfigurationModel } from "@/db/models";
import { IAppConfigurationDb } from "@/db/interfaces/core/IAppConfigurationDb";
import { createId } from "@paralleldrive/cuid2";

export class AppConfigurationDbDrizzle implements IAppConfigurationDb {
  async get(): Promise<AppConfigurationModel | null> {
    const item = await drizzleDb.query.AppConfiguration.findFirst();
    return item || null;
  }
  async create(data: AppConfigurationModel): Promise<void> {
    await drizzleDb.insert(AppConfiguration).values({
      id: createId(),
      updatedAt: new Date(),
      name: data.name,
      theme: data.theme,
      authRequireEmailVerification: data.authRequireEmailVerification,
      authRequireOrganization: data.authRequireOrganization,
      authRequireName: data.authRequireName,
      analyticsSimpleAnalytics: data.analyticsSimpleAnalytics,
      analyticsPlausibleAnalytics: data.analyticsPlausibleAnalytics,
      analyticsGoogleAnalyticsTrackingId: data.analyticsGoogleAnalyticsTrackingId,
      subscriptionRequired: data.subscriptionRequired,
      subscriptionAllowSubscribeBeforeSignUp: data.subscriptionAllowSubscribeBeforeSignUp,
      subscriptionAllowSignUpBeforeSubscribe: data.subscriptionAllowSignUpBeforeSubscribe,
      brandingLogo: data.brandingLogo,
      brandingLogoDarkMode: data.brandingLogoDarkMode,
      brandingIcon: data.brandingIcon,
      brandingIconDarkMode: data.brandingIconDarkMode,
      brandingFavicon: data.brandingFavicon,
      headScripts: data.headScripts,
      bodyScripts: data.bodyScripts,
    });
  }
  async update(data: Partial<AppConfigurationModel>): Promise<void> {
    await drizzleDb.update(AppConfiguration).set({
      updatedAt: new Date(),
      ...data,
    });
  }
  async deleteAll(): Promise<void> {
    await drizzleDb.delete(AppConfiguration).execute();
  }
}

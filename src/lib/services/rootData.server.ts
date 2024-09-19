"server-only";

import { getUserInfo } from "@/lib/services/session.server";
import { getUser } from "@/modules/accounts/services/UserService";
import { getAppConfiguration } from "@/modules/core/services/AppConfigurationService";
import { defaultSiteTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getBaseURL, getDomainName } from "@/lib/services/url.server";
import i18next from "i18next";

export async function getRootData() {
  const userInfo = await getUserInfo();
  const user = userInfo.userId ? await getUser(userInfo.userId) : null;
  const appConfiguration = await getAppConfiguration();

  return {
    metatags: [{ title: `${defaultSiteTags.title}` }],
    user,
    theme: {
      color: userInfo.theme || appConfiguration.theme.color,
      scheme: userInfo.scheme || appConfiguration.theme.scheme,
    },
    locale: i18next.language || "en",
    serverUrl: getBaseURL(),
    domainName: getDomainName(),
    userSession: userInfo,
    authenticated: !!userInfo.userId,
    debug: process.env.NODE_ENV === "development",
    appConfiguration,
    // ...add any other global data you need
  };
}

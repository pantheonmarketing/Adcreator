import { getBaseURL } from "@/lib/services/url.server";
import { defaultAppConfiguration } from "@/modules/core/data/defaultAppConfiguration";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const links = [
    { url: getBaseURL(), lastModified: new Date() },
    { url: `${getBaseURL()}/contact`, lastModified: new Date() },
    { url: `${getBaseURL()}/newsletter`, lastModified: new Date() },
    { url: `${getBaseURL()}/pricing`, lastModified: new Date() },
    { url: `${getBaseURL()}/terms-and-conditions`, lastModified: new Date() },
    { url: `${getBaseURL()}/privacy-policy`, lastModified: new Date() },
    { url: `${getBaseURL()}/rockstack-vs-saasrock`, lastModified: new Date() },
    { url: `${getBaseURL()}/brand`, lastModified: new Date() },
  ];
  if (defaultAppConfiguration.affiliates?.provider.rewardfulApiKey) {
    links.push({ url: `${getBaseURL()}/affiliate-program`, lastModified: new Date() });
  }
  return links;
}

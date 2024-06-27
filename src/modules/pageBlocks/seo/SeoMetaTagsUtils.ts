import { fallbackLng } from "@/i18n/settings";
import { MetaTagsDto } from "@/lib/dtos/MetaTagsDto";
import { getBaseURL } from "@/lib/url";

type SiteTags = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  thumbnail?: string;
  twitterCreator?: string;
  twitterSite?: string;
};
const defaultSiteTags: SiteTags = {
  title: "RockStack Next.js Demo",
  description:
    "Launch production-ready SaaS apps: Auth & User Management, Stripe Subscriptions & Payments, Roles & Permissions, Credits Management, Page Blocks, SEO Optimized, Multi-tenant, Cache, Multi-theme, and Internationalization (i18n).",
  keywords: "remix,nextjs,astro,nuxt,svelte,saas,tailwindcss,prisma,react,typescript,boilerplate,saas-kit,saas-boilerplate,saas-starter-kit,stripe",
  image: "https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1718755479116-rockstack-cover-2.png",
  thumbnail: "https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1718755479116-rockstack-cover-2.png",
  twitterCreator: "@AlexandroMtzG",
  twitterSite: "",
};

function getMetaTags(tags?: SiteTags): MetaTagsDto {
  return parseMetaTags({
    ...defaultSiteTags,
    ...tags,
    // ...getLinkTags(),
  });
}

function parseMetaTags(tags: SiteTags): MetaTagsDto {
  return {
    title: tags.title,
    description: tags.description,
    keywords: tags.keywords,
    openGraph: {
      title: tags.title,
      type: "website",
      images: tags.image ? [{ url: tags.image }] : [],
      description: tags.description,
    },
  };
  // return [
  //   { title: tags.title },
  //   { name: "description", content: tags.description },
  //   { name: "keywords", content: tags.keywords },
  //   { property: "og:title", content: tags.title },
  //   { property: "og:type", content: "website" },
  //   { property: "og:image", content: tags.image },
  //   { property: "og:card", content: "summary_large_image" },
  //   { property: "og:description", content: tags.description },
  //   { property: "twitter:image", content: tags.thumbnail },
  //   { property: "twitter:card", content: "summary_large_image" },
  //   { property: "twitter:creator", content: tags.twitterCreator ?? "" },
  //   { property: "og:creator", content: tags.twitterCreator },
  //   { property: "twitter:site", content: tags.twitterSite ?? "" },
  //   { property: "twitter:title", content: tags.title },
  //   { property: "twitter:description", content: tags.description },
  // ];
}

function getLinkTags(): MetaTagsDto {
  return {};
  // const baseUrl = getBaseURL();
  // const urlObj = new URL(request.url);
  // const pathname = `${baseUrl}${urlObj.pathname}`;
  // const searchParams = urlObj.searchParams;
  // const lng = searchParams.get("lng") ?? fallbackLng;
  // const linkTags: MetaTagsDto = {};

  // // Set the canonical link
  // const canonicalHref = lng === fallbackLng ? pathname : `${pathname}?lng=${lng}`;
  // linkTags.push({ property: "og:locale", content: lng });
  // linkTags.push({ tagName: "link", rel: "canonical", href: canonicalHref });
  // linkTags.push({ property: "og:url", content: canonicalHref });

  // // Add hreflang tags for each supported language
  // i18nConfig.supportedLngs.forEach((supportedLng) => {
  //   const href = supportedLng === i18nConfig.fallbackLng ? pathname : `${pathname}?lng=${supportedLng}`;
  //   linkTags.push({ tagName: "link", rel: "alternate", href: href, hrefLang: supportedLng });
  // });
  // linkTags.push({ tagName: "link", rel: "alternate", href: pathname, hrefLang: "x-default" });

  // return linkTags;
}

export default {
  defaultSiteTags,
  getMetaTags,
};

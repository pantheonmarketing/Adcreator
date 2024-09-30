import { MetaTagsDto } from "@/lib/dtos/MetaTagsDto";
import { PageBlockDto } from "../blocks/PageBlockDto";
import { defaultFaq } from "../defaultBlocks/defaultFaq";
import { defaultFooter } from "../defaultBlocks/defaultFooter";
import { defaultHeader } from "../defaultBlocks/defaultHeader";
import { TFunction } from "i18next";
import { getMetaTags } from "../seo/SeoMetaTagsUtils";
import { PricingBlockData } from "../blocks/marketing/pricing/PricingBlockDto";

export namespace LandingPage {
  export type LoaderData = {
    pricingBlockData: PricingBlockData;
  };
  export async function metatags({ t }: { t: TFunction }) {
    return getMetaTags();
  }
  export function blocks({ data, t }: { data: LoaderData; t: TFunction }): PageBlockDto[] {
    return [
      // Banner
      {
        banner: {
          style: "bottom",
          text: "RockStack demo site.",
          textMd: "This is the RockStack demo site.",
          cta: [{ text: "Back to RockStack.dev", href: "https://rockstack.dev/?ref=nextjs.rockstack.dev", isPrimary: true, target: "_blank" }],
        },
      },
      // Header
      { header: defaultHeader({ t }) },
      // Hero
      {
        hero: {
          style: "bottomImage",
          heading: t("front.hero.heading"),
          subheading: t("front.hero.subheading"),
          image: "https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1727286645348-rockstack-og.png",
          cta: [
            {
              text: t("front.hero.cta1"),
              href: "/pricing",
              isPrimary: true,
            },
            {
              text: t("front.hero.cta2"),
              href: "/contact",
              isPrimary: false,
            },
          ],
          // topText: {
          //   text: t("front.hero.topText"),
          // },
        },
      },
      // Logo Clouds
      // {
      //   logoClouds: {
      //     style: "custom",
      //     headline: t("front.logoClouds.title"),
      //   },
      // },
      // Features
      {
        layout: { css: "py-8" },
        features: {
          style: "cards",
          topText: "Rock-solid",
          headline: "Core Features",
          subheadline: "Explore the essential functionalities that every RockStack edition includes.",
          cta: [
            { text: "Pricing", isPrimary: true, href: "/pricing" },
            { text: "Contact", isPrimary: false, href: "/contact" },
          ],
          grid: {
            columns: "3",
            gap: "md",
          },
          items: [
            {
              name: "Auth & User Management",
              description: "Built-in email/password and user management. No third-party dependencies.",
              link: { href: "https://rockstack.dev/docs/articles/auth-and-user-management", target: "_blank" },
            },
            {
              name: "Subscriptions & Payments",
              description: "Flat-rate, one-time, per-seat, and usage-based payment models with Stripe.",
              link: { href: "https://rockstack.dev/docs/articles/subscriptions-and-payments", target: "_blank" },
            },
            {
              name: "Roles & Permissions",
              description: "Protect your routes and actions with granular roles and permissions.",
              link: { href: "https://rockstack.dev/docs/articles/roles-and-permissions", target: "_blank" },
            },
            {
              name: "Page Blocks",
              description: "Quickly prototype your site's content with configurable blocks.",
              link: { href: "https://rockstack.dev/docs/articles/page-blocks", target: "_blank" },
            },
            {
              name: "SEO Optimized",
              description: "Meta tags and sitemap generation for better search engine visibility.",
              link: { href: "https://rockstack.dev/docs/articles/seo-optimized", target: "_blank" },
            },
            {
              name: "Multi-tenant",
              description: "Each tenant has their app at /app/:tenant, with data segregation using tenantId.",
              link: { href: "https://rockstack.dev/docs/articles/multi-tenant", target: "_blank" },
            },
            {
              name: "Caching",
              description: "Cache the most used data to improve performance and reduce database queries.",
              link: { href: "https://rockstack.dev/docs/articles/cache", target: "_blank" },
            },
            {
              name: "Multi-theme",
              description: "Tailwind CSS, shadcn/ui, dark mode... customize your app's look and feel.",
              link: { href: "https://rockstack.dev/docs/articles/multi-theme", target: "_blank" },
            },
            {
              name: "Internationalization (i18n)",
              description: "Translate your app into multiple languages with i18n.",
              link: { href: "https://rockstack.dev/docs/articles/internationalization-i18n", target: "_blank" },
            },
            // {
            //   name: "Credits Management",
            //   description: "Limit user actions with a built-in credit system.",
            //   link: { href: "https://rockstack.dev/docs/articles/credits-management", target: "_blank" },
            // },
          ],
        },
      },
      // Pricing
      {
        pricing: {
          style: "simple",
          headline: t("front.pricing.title"),
          subheadline: t("front.pricing.headline"),
          data: data.pricingBlockData,
        },
      },
      // Newsletter
      // {
      //   newsletter: {
      //     style: "simple",
      //     headline: t("front.newsletter.title"),
      //     subheadline: t("front.newsletter.headline"),
      //   },
      // },
      {
        testimonials: {
          style: "simple",
          headline: "Testimonials",
          subheadline: "What our customers say about us.",
          items: [
            { name: "John Doe", quote: "This is the best piece of software I've ever seen in my entire life.", stars: 5 },
            { name: "Jane Doe", quote: "I can't believe how easy it is to use RockStack. It's amazing!", stars: 5 },
            { name: "Jack Smith", quote: "I've been using RockStack for 1 day and it's the best day of my life.", stars: 5 },
          ],
        },
      },
      // Faq
      {
        faq: {
          style: "simple",
          headline: t("front.faq.title"),
          subheadline: t("front.faq.subheadline"),
          items: defaultFaq({ t }),
        },
      },
      {
        video: {
          style: "simple",
          headline: "Watch RockStack in action",
          subheadline: "Learn more about RockStack in this short video.",
          src: "https://www.youtube.com/embed/eONZr7TJK6o?si=pmKQ8oZdiL2GH_f5",
        },
      },
      // Footer
      {
        footer: defaultFooter({ t }),
      },
    ];
  }
}

import { verifyUserHasPermission } from "@/modules/permissions/services/UserPermissionsService";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getServerTranslations } from "@/i18n/server";
import { db } from "@/db";
import AdminPricingFeaturesComponent from "./component";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return getMetaTags({
    title: `${t("admin.pricing.new")} | ${defaultSiteTags.title}`,
  });
}

async function load() {
  await verifyUserHasPermission("admin.pricing.create");
  const items = await db.subscriptionProduct.getAllSubscriptionProducts();
  return { plans: items };
}

export default async function () {
  const data = await load();
  return <AdminPricingFeaturesComponent plans={data.plans} />;
}

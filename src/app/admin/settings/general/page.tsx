import { verifyUserHasPermission } from "@/modules/permissions/services/UserPermissionsService";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getServerTranslations } from "@/i18n/server";
import Component from "./component";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return getMetaTags({
    title: `${t("settings.admin.general.title")} | ${defaultSiteTags.title}`,
  });
}

export default async function () {
  await verifyUserHasPermission("admin.settings.general.view");
  return <Component />;
}

"use server";

import { verifyUserHasPermission } from "@/modules/permissions/services/UserPermissionsService";
import { getServerTranslations } from "@/i18n/server";
import { PricingModel } from "@/modules/subscriptions/enums/PricingModel";
import { db } from "@/db";
import defaultPlans from "@/modules/subscriptions/data/defaultPlans.server";
import { createPlans, deletePlan, syncPlan } from "@/modules/subscriptions/services/PricingService";

export const actionAdminPricing = async (prev: any, form: FormData) => {
  await verifyUserHasPermission("admin.pricing.update");
  const { t } = await getServerTranslations();

  const action = form.get("action")?.toString();
  if (action === "create-all-plans") {
    await verifyUserHasPermission("admin.pricing.create");
    const model = Number(form.get("model")) as PricingModel;
    const items = await db.subscriptionProduct.getAllSubscriptionProducts();
    if (items.length > 0) {
      return {
        items,
      };
    }

    await Promise.all(
      defaultPlans
        .filter((f) => f.model === model || model === PricingModel.ALL)
        .map(async (plan) => {
          plan.translatedTitle = t(plan.title);
          plan.usageBasedPrices?.forEach((usageBasedPrice) => {
            usageBasedPrice.unitTitle = t(usageBasedPrice.unitTitle);
            usageBasedPrice.unitTitlePlural = t(usageBasedPrice.unitTitlePlural);
          });
        })
    );

    try {
      await createPlans(defaultPlans.filter((f) => f.model === model || model === PricingModel.ALL));

      return {
        items: await db.subscriptionProduct.getAllSubscriptionProducts(),
      };
    } catch (e: any) {
      return { error: e?.toString() };
    }
  } else if (action === "sync-plan-with-payment-provider") {
    const id = form.get("id")?.toString() ?? "";
    const item = await db.subscriptionProduct.getSubscriptionProduct(id);
    if (!item) {
      return { error: "Pricing plan not found" };
    }
    try {
      item.translatedTitle = t(item.title);
      await syncPlan(
        item,
        item.prices.map((price) => {
          return {
            id: price.id,
            billingPeriod: price.billingPeriod,
            currency: price.currency,
            price: Number(price.price),
          };
        })
      );
      return {
        items: await db.subscriptionProduct.getAllSubscriptionProducts(),
      };
    } catch (error: any) {
      return { error: error.message };
    }
  } else if (action === "bulk-delete") {
    await verifyUserHasPermission("admin.pricing.delete");
    const ids = form.getAll("ids[]");
    const items = await db.subscriptionProduct.getAllSubscriptionProducts();
    const itemsToDelete = items.filter((f) => ids.includes(f.id?.toString() ?? ""));
    await Promise.all(
      itemsToDelete.map(async (item) => {
        // eslint-disable-next-line no-console
        console.log({ item: item.title, tenantProducts: item.tenantProducts?.map((f) => f.tenantSubscriptionId) });
        if (item.tenantProducts && item.tenantProducts.length > 0) {
          throw new Error("Cannot delete a plan with active subscriptions: " + t(item.title));
        }
      })
    );
    await Promise.all(
      itemsToDelete.map(async (item) => {
        await deletePlan(item);
      })
    );
    return { success: "Deleted" };
  }
};

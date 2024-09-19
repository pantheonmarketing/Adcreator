import { mockDb } from "@/db/config/mock/data/mockDb";
import { ISubscriptionFeatureDb } from "@/db/interfaces/subscriptions/ISubscriptionFeatureDb";
import { SubscriptionFeatureModel } from "@/db/models";
import { SubscriptionFeatureLimitType } from "@/modules/subscriptions/enums/SubscriptionFeatureLimitType";

export class SubscriptionFeatureDbMock implements ISubscriptionFeatureDb {
  getAll(): Promise<SubscriptionFeatureModel[]> {
    return Promise.resolve(mockDb.subscriptionFeature);
  }
  get(id: string): Promise<SubscriptionFeatureModel | null> {
    return Promise.resolve(mockDb.subscriptionFeature[0]);
  }
  create(
    subscriptionProductId: string,
    data: {
      order: number;
      title: string;
      name: string;
      type: SubscriptionFeatureLimitType;
      value: number;
      href?: string | null;
      badge?: string | null;
      accumulate?: boolean;
    }
  ): Promise<string> {
    return Promise.resolve("1");
  }
  deleteBySubscriptionProductId(subscriptionProductId: string): Promise<void> {
    return Promise.resolve();
  }
}

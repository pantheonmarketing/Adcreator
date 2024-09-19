import { mockDb } from "@/db/config/mock/data/mockDb";
import { AppConfigurationModel } from "@/db/models";
import { IAppConfigurationDb } from "@/db/interfaces/core/IAppConfigurationDb";

export class AppConfigurationDbMock implements IAppConfigurationDb {
  get(): Promise<AppConfigurationModel | null> {
    if (mockDb.appConfiguration.length === 0) {
      return Promise.resolve(null);
    }
    return Promise.resolve(mockDb.appConfiguration[0]);
  }
  create(data: AppConfigurationModel): Promise<void> {
    mockDb.appConfiguration = [data];
    return Promise.resolve();
  }
  update(data: Partial<AppConfigurationModel>): Promise<void> {
    mockDb.appConfiguration = mockDb.appConfiguration.map((item) => {
      return { ...item, ...data };
    });
    return Promise.resolve();
  }
  deleteAll(): Promise<void> {
    mockDb.appConfiguration = [];
    return Promise.resolve();
  }
}

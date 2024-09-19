import { AppConfigurationModel } from "@/db/models";
import { IAppConfigurationDb } from "@/db/interfaces/core/IAppConfigurationDb";
import { prisma } from "@/db/config/prisma/database";

export class AppConfigurationDbPrisma implements IAppConfigurationDb {
  async get(): Promise<AppConfigurationModel | null> {
    const config = await prisma.appConfiguration.findFirst();
    return config || null;
  }

  async create(data: AppConfigurationModel): Promise<void> {
    await prisma.appConfiguration.create({ data });
  }

  async update(data: Partial<AppConfigurationModel>): Promise<void> {
    await prisma.appConfiguration.updateMany({
      data: data,
    });
  }

  async deleteAll(): Promise<void> {
    await prisma.appConfiguration.deleteMany({});
  }
}

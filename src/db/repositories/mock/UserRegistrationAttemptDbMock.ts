import { IUserRegistrationAttemptDb } from "../../interfaces/accounts/IUserRegistrationAttemptDb";
import { UserRegistrationAttemptModel } from "../../models";
import { mockDb } from "../../config/mock/data/mockDb";

export class UserRegistrationAttemptDbMock implements IUserRegistrationAttemptDb {
  getByEmail(email: string): Promise<UserRegistrationAttemptModel | null> {
    const item = mockDb.userRegistrationAttempt.find((u) => u.email === email);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  getByToken(token: string): Promise<UserRegistrationAttemptModel | null> {
    const item = mockDb.userRegistrationAttempt.find((u) => u.token === token);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  }
  create(data: Omit<UserRegistrationAttemptModel, "id" | "createdAt">): Promise<string> {
    mockDb.userRegistrationAttempt.push({ ...data, id: "2", createdAt: new Date() });
    return Promise.resolve("2");
  }
  update(id: string, data: { firstName?: string; lastName?: string; company?: string | null; createdTenantId?: string | null; token?: string }): Promise<void> {
    mockDb.userRegistrationAttempt = mockDb.userRegistrationAttempt.map((item) => {
      return item.id === id ? { ...item, ...data } : item;
    });
    return Promise.resolve();
  }
}

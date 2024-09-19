import { UserRegistrationAttemptModel } from "../../models";

export interface IUserRegistrationAttemptDb {
  getByEmail(email: string): Promise<UserRegistrationAttemptModel | null>;
  getByToken(token: string): Promise<UserRegistrationAttemptModel | null>;
  create(data: Omit<UserRegistrationAttemptModel, "id" | "createdAt" | "updatedAt">): Promise<string>;
  update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      company?: string | null;
      createdTenantId?: string | null;
      token?: string;
    }
  ): Promise<void>;
}

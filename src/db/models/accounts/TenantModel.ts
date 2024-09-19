import { TenantSubscriptionWithDetailsDto, TenantUserModel, UserDto } from "..";

export type TenantModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  name: string;
  icon: string | null;
  subscriptionId: string | null;
  active: boolean;
};

export type TenantDto = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  active: boolean;
};

export type TenantWithDetailsDto = TenantModel & {
  users: (TenantUserModel & {
    user: UserDto;
  })[];
  subscription: TenantSubscriptionWithDetailsDto | null;
};

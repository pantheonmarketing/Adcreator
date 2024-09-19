export type CreditModel = {
  id: string;
  createdAt: Date;
  tenantId: string;
  userId: string | null;
  amount: number;
  type: string;
  objectId: string | null;
};

export type CreditWithDetailsDto = CreditModel & {
  tenant: { name: string };
  user: { email: string } | null;
};

import { redirect } from "next/navigation";

export async function GET({ params }: { params: { tenant: string } }) {
  redirect(`/app/${params.tenant}/dashboard`);
}

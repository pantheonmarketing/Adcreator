import { resetUserSession } from "@/lib/services/session.server";
import { redirect } from "next/navigation";

export async function GET() {
  resetUserSession();
  redirect("/");
}

import { getServerTranslations } from "@/lib/i18n/server";
import { authenticate } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">{t("shared.title")}</h1>
        <div className="mt-8 max-w-xl mx-auto">
          <form action={authenticate}>
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                {t("shared.name")}
              </label>
              <Input type="email" name="email" placeholder="Email" required />
            </div>
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                {t("shared.name")}
              </label>
              <Input type="password" name="password" placeholder="Password" required />
            </div>
            <div className="mt-4 flex justify-end">
              <LoadingButton />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

import { Button } from "../../components/ui/button";
import { getServerTranslations } from "../../lib/i18n/server";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export default async function Contact() {
  const { t } = await getServerTranslations();

  return (
    <main className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full space-y-4 mx-auto">
        <h1 className="space-x-2 flex justify-center font-bold text-2xl">{t("shared.title")}</h1>
        <div className="mt-8 max-w-xl mx-auto">
          <form className="">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                {t("shared.name")}
              </label>
              <Input id="name" type="text" />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                {t("shared.email")}
              </label>
              <Input id="email" type="email" />
            </div>
            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                {t("shared.message")}
              </label>
              <Textarea id="message" rows={5} />
            </div>
            <Button variant="default" type="submit" className="mt-4">
              {t("shared.submit")}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

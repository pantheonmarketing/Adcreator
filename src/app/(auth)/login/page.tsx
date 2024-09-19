import Logo from "@/components/brand/Logo";
import { defaultSiteTags, getMetaTags } from "@/modules/pageBlocks/seo/SeoMetaTagsUtils";
import { getServerTranslations } from "@/i18n/server";
import InfoBanner from "@/components/ui/banners/InfoBanner";
import LoginForm from "@/modules/accounts/components/auth/LoginForm";
import { getAppConfiguration } from "@/modules/core/services/AppConfigurationService";
import { getUserInfo } from "@/lib/services/session.server";
import { getUser } from "@/modules/accounts/services/UserService";
import { redirect } from "next/navigation";
import { getTenant } from "@/modules/accounts/services/TenantService";

// export async function generateMetadata() {
//   const { t } = await getServerTranslations();
//   return getMetaTags({
//     title: `${t("account.login.title")} | ${defaultSiteTags.title}`,
//   });
// }

async function load() {
  const userInfo = getUserInfo();
  if (userInfo.userId) {
    const user = await getUser(userInfo.userId);
    if (user) {
      if (!user?.defaultTenantId) {
        return redirect("/app");
      } else {
        const tenant = await getTenant(user.defaultTenantId);
        if (tenant) {
          return redirect(`/app/${tenant?.slug ?? tenant.id}`);
        }
      }
    }
  }

  const demoUser = process.env.DEMO_USER?.split(":");
  const demoCredentials = demoUser && demoUser.length > 1 ? { email: demoUser[0], password: demoUser[1] } : undefined;
  return {
    appConfiguration: await getAppConfiguration(),
    demoCredentials,
  };
}
export default async function Page() {
  const { t } = await getServerTranslations();
  const data = await load();
  // const [actionData, action, pending] = useActionState(authenticate, null);

  return (
    <div>
      {/* <main className="h-screen w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="mx-auto w-full space-y-4">
          <h1 className="flex justify-center space-x-2 text-2xl font-bold">{t("shared.title")}</h1>
          <div className="mx-auto mt-8 max-w-xl">
            <form action={action}>
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
                <Button type="submit" disabled={pending} className={clsx(pending && "base-spinner cursor-not-allowed")}>
                  {t("shared.login")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main> */}
      <div className="">
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-sm space-y-5">
            <Logo className="mx-auto h-9" />

            <LoginForm appConfiguration={data.appConfiguration} />

            {data.demoCredentials && (
              <InfoBanner title="Guest Demo Account" text="">
                <b>email:</b>
                <span className="select-all">{data.demoCredentials.email}</span>, <b>password:</b>
                <span className="select-all">{data.demoCredentials.password}</span>.
              </InfoBanner>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import useRootData from "@/lib/state/useRootData";
import LoadingButton from "@/components/ui/buttons/LoadingButton";
import ExclamationTriangleIcon from "@/components/ui/icons/ExclamationTriangleIcon";
import { Input } from "@/components/ui/input";

interface Props {
  isVerifyingEmail?: boolean;
  isSettingUpAccount?: boolean;
  data?: { company?: string; firstName?: string; lastName?: string; email?: string; slug?: string };
  error: string | undefined;
}

export const RegisterForm = ({ isVerifyingEmail = false, isSettingUpAccount = false, data = {}, error }: Props) => {
  const { t } = useTranslation();
  const { appConfiguration, csrf } = useRootData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") ?? undefined;
  const showPasswordInput = !appConfiguration.auth.requireEmailVerification || isVerifyingEmail || isSettingUpAccount;

  return (
    <div className="mx-auto flex flex-col items-center space-y-6 rounded-lg border border-border p-6">
      <input type="hidden" name="redirectTo" value={redirect} hidden readOnly />

      <Form method="post" className="w-full space-y-3">
        <input type="hidden" name="csrf" value={csrf} hidden readOnly />
        {/* Tenant */}
        {appConfiguration.auth.requireOrganization && (
          <div>
            <label htmlFor="company" className="mb-1 text-xs font-medium">
              {t("models.tenant.object")} <span className="text-red-500">*</span>
            </label>
            <Input
              title={t("models.tenant.object")}
              disabled={navigation.state !== "idle"}
              autoFocus
              type="text"
              name="company"
              id="company"
              placeholder={t("account.shared.companyPlaceholder")}
              required
              defaultValue={data.company}
            />
          </div>
        )}
        {/* Tenant: End  */}

        {/* Personal Info */}
        {appConfiguration.auth.requireName && (
          <div className="flex items-end -space-x-px">
            <div className="w-1/2">
              <div>
                <label htmlFor="first-name" className="mb-1 text-xs font-medium">
                  {t("account.shared.name")}
                </label>
                <Input
                  title={t("account.shared.name")}
                  type="text"
                  name="first-name"
                  id="first-name"
                  required
                  defaultValue={data.firstName}
                  className="appearance-none rounded-md rounded-r-none"
                  placeholder={t("account.shared.firstNamePlaceholder")}
                  disabled={navigation.state !== "idle"}
                />
              </div>
            </div>
            <div className="w-1/2">
              <div>
                <Input
                  title=""
                  type="text"
                  name="last-name"
                  id="last-name"
                  defaultValue={data.lastName}
                  required
                  className="appearance-none rounded-md rounded-l-none"
                  placeholder={t("account.shared.lastNamePlaceholder")}
                  disabled={navigation.state !== "idle"}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 text-xs font-medium">
            {t("account.shared.email")} <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            title={t("account.shared.email")}
            id="email"
            name="email"
            autoComplete="email"
            required
            readOnly={isVerifyingEmail}
            defaultValue={data.email}
            placeholder="email@address.com"
            disabled={navigation.state !== "idle"}
          />
        </div>

        {showPasswordInput && (
          <div>
            <label htmlFor="password" className="mb-1 text-xs font-medium">
              {t("account.shared.password")} <span className="text-red-500">*</span>
            </label>
            <Input
              title={t("account.shared.password")}
              type="password"
              id="password"
              name="password"
              required
              placeholder="************"
              disabled={navigation.state !== "idle"}
              defaultValue=""
            />
          </div>
        )}
        {/* Personal Info: End */}

        <div>
          <LoadingButton disabled={navigation.state !== "idle"} className="w-full" type="submit">
            {t("account.register.prompts.register.title")}
          </LoadingButton>
        </div>

        <div id="form-error-message">
          {error && navigation.state === "idle" ? (
            <div className="flex items-center justify-center space-x-2 text-sm text-red-500 dark:text-red-300" role="alert">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <div>{error}</div>
            </div>
          ) : null}
        </div>
      </Form>

      <p className="mt-3 border-t border-border py-2 text-center text-sm">
        {t("account.register.bySigningUp")}{" "}
        <a target="_blank" href="/terms-and-conditions" className="text-primary underline">
          {t("account.register.termsAndConditions")}
        </a>{" "}
        {t("account.register.andOur")}{" "}
        <a target="_blank" href="/privacy-policy" className="text-primary underline">
          {t("account.register.privacyPolicy")}
        </a>
        .
      </p>
    </div>
  );
};

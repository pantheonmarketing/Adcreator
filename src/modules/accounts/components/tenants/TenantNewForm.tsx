"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import LoadingButton from "@/components/ui/buttons/LoadingButton";
import { Form } from "@remix-run/react";
import { Input } from "@/components/ui/input";

export default function TenantNewForm() {
  const { t } = useTranslation();

  const inputName = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    inputName.current?.focus();
    inputName.current?.select();
  }, []);

  return (
    <div>
      <div className="flex flex-1 flex-col justify-between">
        <Form method="post" className="divide-y divide-gray-100">
          <input type="hidden" name="action" value="create" hidden readOnly />
          <div className="space-y-3 pb-5 pt-6">
            <div>
              <div className="mt-1 -space-y-px rounded-md shadow-sm">
                <div>
                  <label className="mb-1 text-xs font-medium">
                    {t("models.tenant.object")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    ref={inputName}
                    type="text"
                    name="name"
                    id="name"
                    placeholder={t("shared.name")}
                    required
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-6 pt-4 text-right">
            <div className="right-0 text-sm leading-5">
              <span className="ml-2 inline-flex rounded-sm shadow-sm">
                <LoadingButton isLoading={pending} type="submit">
                  {t("shared.create")}
                </LoadingButton>
              </span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

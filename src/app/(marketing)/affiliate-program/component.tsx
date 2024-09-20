"use client";

import NumberUtils from "@/lib/utils/NumberUtils";
import { Fragment, useState } from "react";
import { AffiliateProgramDataDto } from "./page";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import { useTranslation } from "react-i18next";

export default function AffiliateProgramComponent({ data }: { data: AffiliateProgramDataDto }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <AffiliatesCalculator percentage={data.affiliates.percentage} plans={data.affiliates.plans} />
      </div>

      {data.affiliates.signUpLink && (
        <div className="mt-4">
          <ButtonPrimary
            event={{ action: "click", category: "affiliate", label: "sign-up", value: data.affiliates.signUpLink }}
            to={data.affiliates.signUpLink}
            target="_blank"
          >
            {t("affiliates.signUp")}
          </ButtonPrimary>
        </div>
      )}

      {data.contactEmail && (
        <Fragment>
          <h3 className="text-xl font-bold">{t("front.contact.title")}</h3>
          <p className="mt-1 text-muted-foreground">
            If you have any questions, contact us at{" "}
            <a href={`mailto:${data.contactEmail}`} className="text-primary">
              {data.contactEmail}
            </a>
            .
          </p>
        </Fragment>
      )}
    </div>
  );
}

function AffiliatesCalculator({
  percentage,
  plans,
}: {
  percentage: number;
  plans: {
    title: string;
    price: number;
  }[];
}) {
  const [customers, setCustomers] = useState(10);
  const [plan, setPlan] = useState(plans.length > 1 ? plans[1] : plans[0]);

  function getTotal() {
    if (!plan) {
      return 0;
    }
    return customers * plan.price * (percentage / 100);
  }
  if (!plan) {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">
        You could make <span className="text-xl font-bold">${NumberUtils.intFormat(getTotal())}</span> usd for every{" "}
        <span className="text-xl font-bold">{customers} customers</span> in the{" "}
        <span className="text-xl font-bold">
          <select
            className="w-36 rounded-lg bg-transparent text-xl font-bold focus:outline-none"
            value={plan.title}
            onChange={(e) => setPlan(plans.find((p) => p.title === e.currentTarget.value)!)}
          >
            {plans.map((plan, idx) => (
              <option key={idx} value={plan.title}>
                {plan.title}
              </option>
            ))}
          </select>
        </span>{" "}
        plan.
      </div>
      <div className="w-full">
        <input
          type="range"
          min="1"
          max="50"
          value={customers}
          onChange={(e) => setCustomers(parseInt(e.currentTarget.value))}
          className="h-4 w-full appearance-none overflow-hidden rounded-lg bg-secondary text-secondary-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}

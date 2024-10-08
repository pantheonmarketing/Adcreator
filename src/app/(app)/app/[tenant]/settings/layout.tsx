"use server";

import { IServerComponentsProps } from "@/lib/dtos/ServerComponentsProps";
import Component from "./component";

export type AppSettingsLayoutLoaderData = {
  isProduction?: boolean;
};

const loader = async () => {
  const data: AppSettingsLayoutLoaderData = {
    isProduction: process.env.NODE_ENV === "production",
  };
  return data;
};

export default async function ({ params, children }: IServerComponentsProps) {
  const data = await loader();
  return <Component data={data} children={children} />;
}

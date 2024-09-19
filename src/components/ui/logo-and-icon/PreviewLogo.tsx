"use client";

import LogoLight from "@/assets/img/logo-light.png";
import LogoDark from "@/assets/img/logo-dark.png";
import { useRootData } from "@/lib/state/useRootData";
import Image from "next/image";

export default function PreviewLogo() {
  const { appConfiguration } = useRootData();
  return (
    <div id="logo" className="w-full space-y-3 lg:grid lg:grid-cols-2 lg:space-y-0">
      <div className="border-2 border-dashed border-border bg-white p-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
          <Image className="mx-auto h-10 w-auto" src={appConfiguration.branding.logo || LogoLight} alt="Logo" />
        </div>
      </div>

      <div className="border-2 border-dashed border-border bg-gray-900 p-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
          <Image className="mx-auto h-10 w-auto" src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoDark} alt="Logo" />
        </div>
      </div>
    </div>
  );
}

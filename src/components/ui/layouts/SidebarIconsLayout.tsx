"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import UrlUtils from "@/lib/utils/UrlUtils";
import Tabs from "../tabs/Tabs";
import SvgOrImg from "@/components/ui/icons/SvgOrImg";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export type IconDto = {
  name: string;
  href: string;
  prefetch?: "intent" | "render" | "none";
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  bottom?: boolean;
  exact?: boolean;
  textIcon?: string;
  textIconSelected?: string;
  hidden?: boolean;
};
export default function SidebarIconsLayout({
  children,
  items,
  label,
  scrollRestoration,
}: {
  children: React.ReactNode;
  items: IconDto[];
  label?: {
    align: "bottom" | "right";
  };
  scrollRestoration?: boolean;
}) {
  const pathname = usePathname();
  const search = useSearchParams();
  const searchParams = new URLSearchParams(search.toString());
  const [currentTab, setCurrentTab] = useState<IconDto>();

  const mainElement = useRef<HTMLDivElement>(null);
  // useElementScrollRestoration({ apply: scrollRestoration ?? false }, mainElement);

  useEffect(() => {
    function findExactRoute(element: IconDto) {
      if (element.exact) {
        return UrlUtils.stripTrailingSlash(pathname) === UrlUtils.stripTrailingSlash(element.href);
      } else {
        return (pathname + searchParams).includes(element.href);
      }
    }
    const current = items.find((element) => findExactRoute(element));
    setCurrentTab(current);
  }, [items, pathname, searchParams]);

  return (
    <div className="sm:flex sm:h-[calc(100vh-56px)] sm:flex-row sm:bg-gray-50">
      <div
        className={clsx(
          "hidden flex-none flex-col items-center justify-between border-r border-gray-200 bg-gray-100 shadow-sm sm:flex",
          label?.align === "bottom" && "lg:text-center"
        )}
      >
        <div className="flex w-full flex-col items-center">
          {items
            .filter((f) => !f.bottom && !f.hidden)
            .map((item, idx) => {
              return <IconLink key={idx} {...item} current={currentTab?.name === item.name} label={label} />;
            })}
        </div>
        {items.filter((f) => f.bottom && !f.hidden).length > 0 && (
          <div className="flex w-full flex-col space-y-2 pb-5">
            {items
              .filter((f) => f.bottom && !f.hidden)
              .map((item, idx) => {
                return <IconLink key={idx} {...item} current={currentTab?.name === item.name} label={label} />;
              })}
          </div>
        )}
      </div>

      <div className="w-full border-b border-gray-300 bg-white py-2 shadow-sm sm:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between space-x-2 px-4 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-screen-2xl">
          <Tabs
            tabs={items
              .filter((f) => !f.hidden)
              .map((i) => {
                return { name: i.name, routePath: i.href };
              })}
            className="flex-grow"
          />
        </div>
      </div>

      <div ref={mainElement} className="w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

function IconLink({
  name,
  href,
  prefetch,
  icon,
  current,
  iconSelected,
  label,
  textIcon,
  textIconSelected,
}: {
  name: string;
  href: string;
  prefetch?: "intent" | "render" | "none";
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  current: boolean;
  label?: {
    align: "bottom" | "right";
  };
  textIcon?: string;
  textIconSelected?: string;
}) {
  return (
    <div className={clsx("w-full px-1 py-1")}>
      <Link
        // prefetch={prefetch}
        href={href}
        className={clsx(
          "flex w-11 items-center justify-center rounded-md border px-2 py-2 text-xs hover:border-gray-300 hover:bg-gray-200 hover:text-gray-900",
          current ? "border-gray-300 bg-gray-200 text-gray-800" : "border-transparent text-gray-500",
          !label ? "w-11" : "lg:w-auto lg:justify-start",
          label?.align === "bottom" && "flex-col space-y-1",
          label?.align === "right" && "flex-row space-x-2"
        )}
      >
        {textIcon !== undefined && textIconSelected !== undefined ? (
          <div>
            {current ? <SvgOrImg className="h-5 w-5 text-gray-500" icon={textIconSelected} /> : <SvgOrImg className="h-5 w-5 text-gray-400" icon={textIcon} />}
          </div>
        ) : (
          <div>{current ? iconSelected : icon}</div>
        )}
        {label !== undefined && (
          <div className={clsx([icon, iconSelected, textIcon, textIconSelected].some((f) => f !== undefined) && "hidden lg:block")}>{name}</div>
        )}
      </Link>
    </div>
  );
}

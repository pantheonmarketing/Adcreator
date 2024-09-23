"use client";

import clsx from "clsx";

interface Props {
  small?: boolean;
  loading: boolean;
}
export default function Loading({ small = false, loading }: Props) {
  return (
    <>
      {loading && (
        <div className="space-y-2 pb-4 pt-4 text-center">
          <div className={clsx("flex h-auto w-full flex-col justify-center space-y-4 py-12 text-center", small && "py-2")}>
            <div className={clsx("loader mx-auto rounded-full border-slate-200 ease-linear", small ? "h-10 w-10 border-4" : "h-20 w-20 border-4")}></div>
          </div>
        </div>
      )}
    </>
  );
}

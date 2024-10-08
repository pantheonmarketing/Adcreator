import { TenantDto } from "@/db/models";
import useRootData from "@/lib/state/useRootData";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TenantSelect({ currentTenant }: { currentTenant: TenantDto | null }) {
  const params = useParams();
  const { user } = useRootData();
  if (!currentTenant || !user) {
    return null;
  }
  return (
    <>
      <Link href={`/app/${params.tenant}/settings/account`} className="group flex flex-shrink-0 bg-slate-800 p-4 focus:outline-none">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center truncate text-left">
              {currentTenant.icon ? (
                <img className="inline-block h-9 w-9 shrink-0 rounded-full bg-gray-500 shadow-sm" src={currentTenant.icon} alt={currentTenant.name} />
              ) : (
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium leading-none text-primary-foreground">{currentTenant.name.substring(0, 1)}</span>
                </span>
              )}
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-200 group-hover:text-white">{currentTenant.name}</p>
                <p className="truncate text-xs font-medium text-gray-300 group-hover:text-gray-200">{user.email}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </Link>
    </>
  );
}

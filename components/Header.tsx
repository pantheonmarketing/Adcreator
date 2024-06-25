import Link from "next/link";
import { logout, toggleLightOrDarkMode } from "@/app/(marketing)/actions";
import { Button } from "./ui/button";
import { getUserInfo } from "@/lib/session";
import LocaleSelector from "./ui/selectors/LocaleSelector";
import ThemeSelector from "./ui/selectors/ThemeSelector";
import DarkModeToggle from "./ui/toggles/DarkModeToggle";

export default async function Header() {
  const userInfo = getUserInfo();
  return (
    <header className="p-4 flex justify-center w-full">
      <div className="flex items-center gap-5 justify-between">
        <nav className="gap-5 flex items-center">
          <Link href="/" className="mr-4">
            Home
          </Link>
          <Link href="/contact" className="mr-4">
            Contact
          </Link>
          <Link href="/login" className="mr-4">
            Login
          </Link>
          <Link href="/app" className="mr-4">
            App
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <div className="flex flex-row justify-center items-center gap-4">
            <LocaleSelector />
            <ThemeSelector currentTheme={userInfo.theme} />
            <DarkModeToggle currentLightOrDarkMode={userInfo.lightOrDarkMode} />
          </div>

          <div>
            {userInfo.userId ? (
              <form action={logout}>
                <Button>Logout</Button>
              </form>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

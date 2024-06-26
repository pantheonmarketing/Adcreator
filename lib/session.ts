import { parse, serialize } from "cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultThemeColor, defaultThemeScheme } from "./theme";

const SESSION_COOKIE_NAME = "RS_session";
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export type UserSession = {
  userId: string | null;
  lightOrDarkMode: string;
  theme?: string;
};

function getUserSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  try {
    const parsed = parse(sessionCookie);
    return JSON.parse(parsed[SESSION_COOKIE_NAME]);
  } catch (e: any) {
    // console.error("Error parsing session cookie", e.message);
    return null;
  }
}

export function getUserInfo(): UserSession {
  const session = getUserSession();
  const userId = session?.userId ?? null;
  const lightOrDarkMode = session?.lightOrDarkMode || defaultThemeScheme;
  const theme = session?.theme ?? defaultThemeColor;
  return {
    userId,
    lightOrDarkMode,
    theme,
  };
}

export function setUserSession(userSession: UserSession) {
  const cookieStore = cookies();
  const serializedSession = serialize(SESSION_COOKIE_NAME, JSON.stringify(userSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_NAME, serializedSession);
}

// export function resetUserSession() {
//   const cookieStore = cookies();
//   const serializedSession = serialize(SESSION_COOKIE_NAME, "", { maxAge: -1, path: "/" });
//   cookieStore.set(SESSION_COOKIE_NAME, serializedSession);
//   return redirect("/login");
// }

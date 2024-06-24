"use server";

// import { DEFAULT_LOCALE, Locale } from "@/lib/i18n";
import { Theme, getThemeFromCookies, setThemeCookie } from "@/lib/theme";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export async function changeLocale(formData: FormData) {
//   const localeValue = formData.get("locale");
//   const redirectTo = formData.get("redirectTo") as string;
//   if (!localeValue || typeof localeValue !== "string") {
//     return redirect(redirectTo || "/");
//   }

//   const locale = localeValue as Locale;
//   if (!(locale in Locale)) {
//     cookies().set("locale", DEFAULT_LOCALE);
//     return redirect(redirectTo || "/");
//   }

//   cookies().set("locale", localeValue);
//   return redirect(redirectTo || "/");
// }

export async function toggleTheme(formData: FormData) {
  const redirectTo = formData.get("redirectTo") as string;
  const cookieStore = cookies();
  const currentTheme = getThemeFromCookies(cookieStore);
  const newTheme = currentTheme === Theme.Light ? Theme.Dark : Theme.Light;

  setThemeCookie(cookieStore, newTheme);
  return redirect(redirectTo || "/");
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export const DEFAULT_THEME = Theme.Light;

export function getThemeFromCookies(cookies: any): Theme {
  const theme = cookies.get("theme")?.value;
  return theme === Theme.Dark ? Theme.Dark : Theme.Light;
}

export function setThemeCookie(cookies: any, theme: Theme) {
  cookies.set("theme", theme);
}

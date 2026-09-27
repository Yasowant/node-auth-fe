import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
};

const prefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

/** Explicit light/dark override, backed by localStorage. `null` means
 *  "no override yet" -- the CSS media query is driving it off the OS
 *  setting, same as before this hook ever ran. */
export function useTheme() {
  const [theme, setTheme] = useState(
    () => readStoredTheme() ?? (prefersDark() ? "dark" : "light"),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Non-critical -- the toggle still works for this page load, it just
      // won't be remembered next visit.
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}

export default useTheme;

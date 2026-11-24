"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themePreference: "system",
  resolvedTheme: "light",
  setThemePreference: () => {},
});

export const THEME_STORAGE_KEY = "smv_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Read initial preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setThemePreferenceState(stored);
      }
    } catch {}
  }, []);

  // Update DOM & listen for system preference changes
  useEffect(() => {
    function computeResolvedTheme(pref: ThemePreference): ResolvedTheme {
      if (pref === "dark") return "dark";
      if (pref === "light") return "light";
      if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }

    const active = computeResolvedTheme(themePreference);
    setResolvedTheme(active);

    const root = document.documentElement;
    root.dataset.theme = active;
    if (active === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Media query listener when preference is "system"
    if (themePreference === "system" && typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        const newTheme: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(newTheme);
        root.dataset.theme = newTheme;
        if (newTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [themePreference]);

  function setThemePreference(pref: ThemePreference) {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ themePreference, resolvedTheme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

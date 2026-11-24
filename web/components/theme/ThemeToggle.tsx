"use client";

import React from "react";
import { useTheme, ThemePreference } from "@/context/ThemeContext";

interface ThemeToggleProps {
  variant?: "compact" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "compact", className = "" }: ThemeToggleProps) {
  const { themePreference, setThemePreference } = useTheme();

  const options: Array<{ id: ThemePreference; label: string; icon: React.ReactNode }> = [
    {
      id: "light",
      label: "Light",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "dark",
      label: "Dark",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      id: "system",
      label: "System",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode selector"
        className={`inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10 ${className}`}
      >
        {options.map((opt) => {
          const isSelected = themePreference === opt.id;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              type="button"
              onClick={() => setThemePreference(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#F5951C] text-[#0E0D0C] shadow-sm font-bold"
                  : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact icon pill for headers
  return (
    <div
      role="radiogroup"
      aria-label="Theme mode switcher"
      className={`inline-flex items-center p-0.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm ${className}`}
    >
      {options.map((opt) => {
        const isSelected = themePreference === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${opt.label} mode`}
            title={`${opt.label} mode`}
            type="button"
            onClick={() => setThemePreference(opt.id)}
            className={`p-1.5 rounded-full transition-all ${
              isSelected
                ? "bg-[#F5951C] text-[#0E0D0C] shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

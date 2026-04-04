"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeCookies() {
  const { theme } = useTheme();

  useEffect(() => {
    // Set a cookie when the theme changes
    if (theme) {
      document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [theme]);

  return null;
}

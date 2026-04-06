"use client";

import { GooeyToaster } from "goey-toast";
import { useTheme } from "next-themes";

export const Toaster = () => {
  const { theme = "system" } = useTheme();

  return <GooeyToaster theme={theme === "dark" ? "dark" : "light"} position="bottom-right" />;
};

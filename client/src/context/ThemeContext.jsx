"use client";

import { createContext } from "react";
import { cyberTheme } from "@/themes/cyber";

export const ThemeContext = createContext(cyberTheme);

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={cyberTheme}>{children}</ThemeContext.Provider>;
}

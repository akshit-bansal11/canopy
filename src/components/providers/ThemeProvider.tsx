"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Mode = "light" | "dark";

export interface Theme {
  id: string;
  name: string;
  color: string;
}

export const THEMES: Theme[] = [
  { id: "neutral", name: "Neutral", color: "#a1a1aa" },
  { id: "indigo", name: "Indigo", color: "#6366f1" },
  { id: "midnight", name: "Midnight", color: "#06b6d4" },
  { id: "forest", name: "Forest", color: "#34d399" },
  { id: "sunset", name: "Sunset", color: "#fb7185" },
  { id: "nebula", name: "Nebula", color: "#d8b4fe" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "amber", name: "Amber", color: "#d97706" },
  { id: "teal", name: "Teal", color: "#0d9488" },
  { id: "rose", name: "Rose", color: "#e11d48" },
  { id: "cyber", name: "Cyber", color: "#00ff00" },
  { id: "brown", name: "Brown", color: "#8d6e63" },
  { id: "sky", name: "Sky", color: "#0ea5e9" },
  { id: "pink", name: "Pink", color: "#ff79c6" },
];

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app-theme") || "neutral";
    }
    return "neutral";
  });

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("app-mode") as Mode) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-mode", mode);
    localStorage.setItem("app-mode", mode);

    // Also manage 'dark' class for tailwind/other tools that might expect it
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, mode, setMode, themes: THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// src/contexts/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
  darkMode: boolean;
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  darkMode: false,
  theme: "system",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
    setTheme(storedTheme || "system");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
    const applyDarkMode = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    };
  
    applyDarkMode();
  
    if (theme === "system") {
      mediaQuery.addEventListener("change", applyDarkMode);
      return () => mediaQuery.removeEventListener("change", applyDarkMode);
    }
  
    localStorage.setItem("theme", theme);
  }, [theme]);
  

  return (
    <ThemeContext.Provider value={{ darkMode, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

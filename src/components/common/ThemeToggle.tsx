"use client";

import { useContext } from "react";
import { createContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Import the context directly to check if available
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  try {
    const { theme, toggleTheme } = useTheme();

    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label={theme === "light" ? "ダークモードに切り替え" : "ライトモードに切り替え"}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    );
  } catch {
    return null;
  }
}

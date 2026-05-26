"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "light" | "dark";
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const handleClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) return <span className="w-10 h-10 inline-flex items-center justify-center">🌙</span>;

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
      aria-label="テーマ切替"
      type="button"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

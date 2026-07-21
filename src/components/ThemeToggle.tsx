"use client";

import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-lg shadow-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
      aria-label="Alternar tema"
    >
      {theme == "light" ? "🌙" : "☀️"}
    </button>
  );
}

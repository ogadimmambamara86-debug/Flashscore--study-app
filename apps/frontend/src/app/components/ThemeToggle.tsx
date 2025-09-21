
"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    }
  }, []);

  // Apply to <html> element + save preference
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="btn btn-primary fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      style={{
        background: theme === "dark" 
          ? "linear-gradient(135deg, #374151, #1f2937)" 
          : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "600",
        boxShadow: theme === "dark" 
          ? "0 4px 16px rgba(0, 0, 0, 0.5)" 
          : "0 4px 16px rgba(59, 130, 246, 0.3)"
      }}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <>
          <span>🌙</span>
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <span>☀️</span>
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
}

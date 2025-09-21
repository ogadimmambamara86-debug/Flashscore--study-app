"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"sports" | "nature">("sports");

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "sports" | "nature" | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default is Sports Central, switch if device prefers light
      if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("nature");
      }
    }
  }, []);

  // Apply to <body> + save preference
  useEffect(() => {
    document.body.classList.remove("sports", "nature");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "sports" ? "nature" : "sports")}
      className="btn btn-primary fixed bottom-4 right-4 z-50"
    >
      {theme === "sports" ? "Switch to Nature 🌱" : "Switch to Sports 🏆"}
    </button>
  );
}
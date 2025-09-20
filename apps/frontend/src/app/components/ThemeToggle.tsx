"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"spacex" | "nature">("spacex");

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "spacex" | "nature" | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // If no saved theme → default SpaceX
      setTheme("spacex");

      // Optional: auto-switch if device prefers light mode
      if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("nature");
      }
    }
  }, []);

  // Apply theme and save preference
  useEffect(() => {
    document.body.classList.remove("spacex", "nature");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "spacex" ? "nature" : "spacex")}
      className="btn btn-primary fixed bottom-4 right-4 z-50"
    >
      {theme === "spacex" ? "Switch to Nature 🌱" : "Switch to SpaceX 🚀"}
    </button>
  );
}
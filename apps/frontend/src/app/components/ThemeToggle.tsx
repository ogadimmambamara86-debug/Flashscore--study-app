"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("spacex");

  useEffect(() => {
    document.body.classList.remove("spacex", "nature");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "spacex" ? "nature" : "spacex")}
      className="btn btn-primary fixed bottom-4 right-4"
    >
      {theme === "spacex" ? "Switch to Nature" : "Switch to SpaceX"}
    </button>
  );
}
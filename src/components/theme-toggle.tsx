"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ initial }: { initial: "light" | "dark" }) {
  const [theme, setTheme] = useState(initial);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `theme=${next}; path=/; max-age=31536000`; // SSR читає її в layout
    setTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={toggle}
      aria-label="Змінити тему"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

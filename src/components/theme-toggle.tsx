"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = "outline",
  size = "sm",
  showLabel = true,
  className = ""
}: ThemeToggleProps) {
  //const { theme, setTheme } = useUIStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !theme) {
      const systemTheme =
        resolvedTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      setTheme(systemTheme);
    }
  }, [mounted, theme, resolvedTheme, setTheme]);

  if (!mounted) {
    return null;
  }

  const cycleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme as "light" | "dark" | "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const effectiveTheme = resolvedTheme || theme;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={cycleTheme}
      className={className}
    >
      {getThemeIcon()}
      {showLabel && <span className="ml-2">{theme}</span>}
    </Button>
  );
}

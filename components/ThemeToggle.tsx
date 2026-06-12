"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ThemeToggle() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("legawa-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("legawa-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("legawa-theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) return null;
  if (pathname === "/roster") return null;

  return (
    <button
      onClick={toggle}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-3 rounded-full border border-theme-border bg-theme-bg/80 px-5 py-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-theme-text backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-theme-bg hover:shadow-xl"
      aria-label="Toggle Theme"
    >
      {/* Switch Track */}
      <div className="relative flex h-5 w-9 items-center rounded-full bg-theme-border/50">
        {/* Switch Knob */}
        <div
          className={`absolute h-4 w-4 rounded-full shadow-sm transition-transform duration-500 ${
            isDark ? "translate-x-4 bg-theme-bg" : "translate-x-1 bg-theme-accent"
          }`}
        />
      </div>
    </button>
  );
}

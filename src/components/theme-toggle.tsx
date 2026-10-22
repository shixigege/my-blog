"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("theme");
    if (s === "dark" || (!s && matchMedia("(prefers-color-scheme:dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono tracking-wider border border-rule hover:border-rule-strong hover:bg-card transition-colors text-ink-secondary hover:text-ink cursor-pointer rounded-xs"
      title={dark ? "切换为白日报版" : "切换为夜读模式"}
    >
      <span className="text-vermilion">{dark ? "☼" : "☾"}</span>
      <span className="hidden sm:inline uppercase text-[0.7rem]">
        {dark ? "DAY" : "NIGHT"}
      </span>
    </button>
  );
}

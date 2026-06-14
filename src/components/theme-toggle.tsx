"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const s = localStorage.getItem("theme");
    if (s === "dark" || (!s && matchMedia("(prefers-color-scheme:dark)").matches)) {
      setDark(true); document.documentElement.classList.add("dark");
    }
  }, []);
  return (
    <button onClick={() => {
      const n = !dark; setDark(n);
      document.documentElement.classList.toggle("dark", n);
      localStorage.setItem("theme", n ? "dark" : "light");
    }} className="text-sm text-text-secondary hover:text-accent transition-colors px-2 py-1" title={dark ? "切换亮色" : "切换暗色"}>
      {dark ? "☀" : "☾"}
    </button>
  );
}

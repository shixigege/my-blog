"use client";
import { useEffect } from "react";

export function ProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    const onScroll = () => {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = height > 0 ? `${(scroll / height) * 100}%` : "0%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div id="progress-bar" />;
}

"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Nav } from "@/components/nav";
import { useEffect, useState } from "react";

export function NewspaperMasthead() {
  const [dateStr, setDateStr] = useState("2026 年 10 月 22 日 · 星期四");
  const [enDate, setEnDate] = useState("OCT 22, 2026");

  useEffect(() => {
    const now = new Date();
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    setDateStr(`${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · 星期${days[now.getDay()]}`);
    
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    setEnDate(`${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  return (
    <header className="w-full select-none pt-4 pb-2">
      {/* ===== 顶栏报耳 (Masthead Ears & Metadata) ===== */}
      <div className="flex justify-between items-center text-[0.72rem] font-mono tracking-wider text-ink-muted border-b border-rule pb-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-vermilion px-1.5 py-0.5 bg-vermilion/10 border border-vermilion/20 text-[0.68rem]">
            VOL. 2026
          </span>
          <span className="hidden sm:inline">NO. 10 · DISPATCH</span>
          <span className="hidden md:inline text-ink-muted/50">|</span>
          <span className="hidden md:inline">SYSTEM: LATENCY 12MS</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{dateStr}</span>
          <span className="font-semibold text-ink-secondary">{enDate}</span>
          <span className="hidden md:inline text-vermilion">● ONLINE</span>
        </div>
      </div>

      {/* ===== 核心大报头 (Main Newspaper Title) ===== */}
      <div className="text-center py-3 sm:py-6 relative">
        <Link href="/" className="inline-block group">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight md:tracking-wide text-ink uppercase transition-opacity duration-200 group-hover:opacity-90">
            {siteConfig.title}
          </h1>
        </Link>

        {/* 副标题与古典细线 */}
        <div className="flex items-center justify-center gap-3 mt-3 max-w-lg mx-auto">
          <div className="flex-1 h-[1px] bg-rule-strong" />
          <p className="text-xs sm:text-sm font-serif text-ink-secondary tracking-widest whitespace-nowrap">
            {siteConfig.description}
          </p>
          <div className="flex-1 h-[1px] bg-rule-strong" />
        </div>
      </div>

      {/* ===== 报纸通栏导航条 ===== */}
      <Nav />
    </header>
  );
}

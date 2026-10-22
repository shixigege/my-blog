"use client";

import dynamic from "next/dynamic";

export const DynamicNewsboy = dynamic(
  () => import("@/components/newsboy").then((mod) => mod.Newsboy),
  {
    ssr: false,
    loading: () => (
      <div className="classified-box p-4 text-center my-4 min-h-[220px] flex items-center justify-center">
        <span className="text-xs font-mono text-ink-muted">[ 加载报童中... ]</span>
      </div>
    ),
  }
);

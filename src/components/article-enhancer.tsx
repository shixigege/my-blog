"use client";

import { useEffect, useRef } from "react";

export function ArticleEnhancer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const preElements = containerRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.textContent = "复制";
      btn.className =
        "copy-btn absolute right-2 top-2 text-[0.68rem] text-ink-muted hover:text-vermilion px-2 py-0.5 bg-[#1F2024] border border-rule transition-colors font-mono cursor-pointer rounded-xs";

      btn.onclick = () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "已复制";
          setTimeout(() => {
            btn.textContent = "复制";
          }, 1500);
        });
      };

      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

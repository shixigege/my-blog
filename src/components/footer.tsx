import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-10 pt-6 pb-12 border-t-2 border-rule-strong text-center text-xs font-serif text-ink-muted select-none">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase font-mono text-ink-secondary">
          <span>◈</span>
          <span>SHIXIGEGE&apos;S DISPATCH · INDEPENDENT TECH PUBLICATION</span>
          <span>◈</span>
        </div>

        <p className="font-mono text-[0.7rem] text-ink-secondary">
          &copy; {currentYear} {siteConfig.author} · 本报基于 Next.js 16 静态印行 · 遵循开放网络协议
        </p>

        <div className="flex items-center justify-center gap-4 text-[0.7rem] font-mono text-ink-muted pt-1">
          <span>
            印张总览 / 访问量：
            <span
              id="busuanzi_value_site_pv"
              className="font-bold text-vermilion ml-1"
            >
              -
            </span>
          </span>
          <span>|</span>
          <span>FORMAT: BROADSHEET 2.0</span>
        </div>
      </div>
    </footer>
  );
}

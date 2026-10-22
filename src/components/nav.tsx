"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "头版", en: "FRONT", href: "/" },
  { label: "专栏", en: "ARTICLES", href: "/blog" },
  { label: "归档", en: "ARCHIVE", href: "/archive" },
  { label: "标签", en: "TAGS", href: "/tags" },
  { label: "友链", en: "COMMUNITY", href: "/friends" },
  { label: "关于", en: "ABOUT", href: "/about" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="w-full rule-double-y py-2.5 my-3 bg-paper">
      <div className="flex items-center justify-between px-2 sm:px-6 max-w-5xl mx-auto flex-wrap gap-y-2">
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6 flex-wrap justify-center flex-1">
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <div key={item.href} className="flex items-center gap-2 sm:gap-4">
                {index > 0 && (
                  <span className="text-rule text-xs select-none font-mono">/</span>
                )}
                <Link
                  href={item.href}
                  className={clsx(
                    "group flex items-baseline gap-1 text-sm tracking-wider transition-colors duration-200 py-0.5 px-1 relative",
                    isActive
                      ? "text-vermilion font-bold"
                      : "text-ink-secondary hover:text-ink font-medium"
                  )}
                >
                  <span className="font-serif text-[0.95rem]">{item.label}</span>
                  <span
                    className={clsx(
                      "text-[0.65rem] font-mono tracking-widest uppercase transition-opacity",
                      isActive
                        ? "text-vermilion opacity-90"
                        : "text-ink-muted group-hover:opacity-100"
                    )}
                  >
                    {item.en}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1 right-1 h-[2px] bg-vermilion rounded-full" />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* 报纸右侧功能区：主题切换 */}
        <div className="flex items-center pl-2 border-l border-rule">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

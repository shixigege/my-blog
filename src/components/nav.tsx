"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthStatus } from "@/components/auth-status";

const links = [
  { label: "首页", href: "/" },
  { label: "归档", href: "/archive" },
  { label: "随笔", href: "/tags/随笔" },
  { label: "标签", href: "/tags" },
  { label: "友链", href: "/friends" },
  { label: "关于", href: "/about" },
  { label: "写作", href: "/write" },
];

export function Nav() {
  const p = usePathname();
  if (p.startsWith("/write")) return null;
  return (
    <nav className="text-center py-2 border-b border-border mb-0">
      <div className="flex items-center justify-center gap-1 text-sm flex-wrap">
        {links.map((l, i) => (
          <span key={l.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-border text-xs mx-1">·</span>}
            <Link
              href={l.href}
              className={clsx(
                "nav-link tracking-wide transition-colors hover:text-accent px-1",
                p === l.href ? "text-accent font-medium" : "text-text-secondary"
              )}
            >
              {l.label}
            </Link>
          </span>
        ))}
        <span className="text-border text-xs mx-1">·</span>
        <ThemeToggle />
        <span className="text-border text-xs mx-1">·</span>
        <AuthStatus />
      </div>
    </nav>
  );
}

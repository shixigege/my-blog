import type { Metadata } from "next";
import Link from "next/link";
import { DM_Serif_Display, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { AvatarDisplay } from "@/components/avatar-display";
import { LeftSidebar } from "@/components/left-sidebar";
import { Sidebar } from "@/components/sidebar";
import { PageTransition } from "@/components/page-transition";
import { siteConfig } from "@/config/site";

const dmSerif = DM_Serif_Display({ weight: ["400"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const notoSerif = Noto_Serif_SC({ weight: ["400","500","600","700"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const jetbrains = JetBrains_Mono({ weight: ["400","500"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s · ${siteConfig.title}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · 星期${days[now.getDay()]}`;

  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${dmSerif.variable} ${notoSerif.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`
        }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ProgressBar />

        <div className="flex-1 w-full py-8 px-6">
        <div className="newspaper-layout">
          {/* 左侧边栏 */}
          <LeftSidebar />

          {/* 主报纸区（堆叠效果） */}
          <div className="newspaper-stack-wrapper">
            <div className="newspaper-container p-8 md:p-12 lg:p-16">
              {/* 报头信息栏 */}
              <div className="flex justify-between items-center text-[.75rem] text-text-secondary font-mono tracking-wider pb-2 border-b border-border mb-0">
                <span className="text-accent font-semibold">Vol. I · No. 1</span>
                <span className="hidden sm:inline">戊申年 · 仲夏</span>
                <span>{dateStr}</span>
              </div>

              {/* 报头（刊头） */}
              <header className="newspaper-masthead border-t-0 pt-4 pb-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center md:items-center gap-2">
                    <Link href="/" className="block hover:opacity-80 transition-opacity">
                      <AvatarDisplay author={siteConfig.author} fallback={siteConfig.avatar} />
                    </Link>
                    <p className="text-[.9rem] text-text-secondary font-mono tracking-widest uppercase">主编</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
                        className="text-text-secondary hover:text-accent transition-colors"
                        title="GitHub">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
                      <a href={siteConfig.leetcode} target="_blank" rel="noopener noreferrer"
                        className="text-text-secondary hover:text-accent transition-colors"
                        title="LeetCode">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.926-.753-2.075-1.14-3.265-1.097V1.38a1.375 1.375 0 0 0-.546-1.068 1.383 1.383 0 0 0-.951-.312zM16.718 8.88a1.35 1.35 0 0 0-.961.438c-.537.539-.537 1.414 0 1.953l4.171 4.084c.652.64.972 1.47.948 2.262a2.68 2.68 0 0 1-.066.523 2.545 2.545 0 0 1-.619 1.164l-3.004 3.222c-1.058 1.134-3.204 1.27-4.43.278l-3.5-2.831c-.593-.48-1.461-.387-1.94.207a1.384 1.384 0 0 0 .207 1.943l3.5 2.831c.926.753 2.075 1.14 3.265 1.097V22.62c0 .762.619 1.38 1.382 1.38s1.382-.618 1.382-1.38v-1.182c.185.032.372.047.561.047 1.258 0 2.535-.475 3.5-1.39l3.004-3.222c.562-.602.984-1.328 1.22-2.125a5.527 5.527 0 0 0 .062-2.362 5.355 5.355 0 0 0-.349-1.017 5.938 5.938 0 0 0-1.271-1.818l-4.171-4.084a1.35 1.35 0 0 0-.961-.438z" />
                        </svg>
                      </a>
                      <a href={`mailto:${siteConfig.email}`}
                        className="text-text-secondary hover:text-accent transition-colors"
                        title="QQ 邮箱">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M22 4L12 13 2 4" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-center">
                    <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-[.14em] text-text uppercase">
                      {siteConfig.title}
                    </h1>
                    <div className="w-24 h-[3px] bg-accent mx-auto my-2" />
                    <p className="text-[.8rem] text-accent font-mono tracking-widest uppercase">
                      慢下来，写点什么
                    </p>
                    <p className="text-[.7rem] text-text-secondary font-mono tracking-wider mt-1.5 max-w-md mx-auto">
                      {siteConfig.description}
                    </p>
                  </div>
                </div>
              </header>

              {/* Navigation */}
              <Nav />

              {/* Main content */}
              <main className="mt-4">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </div>

          {/* 右侧边栏 */}
          <aside className="right-sidebar-wrapper">
            <Sidebar />
          </aside>
        </div>
      </div>

        <Footer />
        <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";
import { NewspaperMasthead } from "@/components/newspaper-masthead";
import { PageTransition } from "@/components/page-transition";
import { siteConfig } from "@/config/site";

const playfair = Playfair_Display({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s · ${siteConfig.title}` },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${playfair.variable} ${notoSerif.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen py-4 sm:py-8 px-2 sm:px-6 md:px-10 flex flex-col items-center">
        <ProgressBar />

        {/* 现代大报版芯容器 (The Broadsheet Container) */}
        <div className="w-full max-w-6xl bg-paper border border-rule shadow-paper px-4 sm:px-8 md:px-12 py-6 my-auto transition-colors duration-200">
          <NewspaperMasthead />

          <main className="w-full mt-4">
            <PageTransition>{children}</PageTransition>
          </main>

          <Footer />
        </div>

        <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" />
      </body>
    </html>
  );
}

import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown-renderer";
import { AvatarDisplay } from "@/components/avatar-display";

export const metadata = { title: "主编档案" };

export default async function AboutPage() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));

  const firstPost = posts.reduce(
    (earliest, p) => (p.date < earliest.date ? p : earliest),
    posts[0] || { date: new Date().toISOString().slice(0, 10) }
  );
  const daysSince = Math.max(
    1,
    Math.floor((Date.now() - new Date(firstPost.date).getTime()) / 86400000)
  );

  let aboutHtml = "";
  try {
    const md = await fs.readFile(
      path.join(process.cwd(), "public", "about", "index.md"),
      "utf-8"
    );
    aboutHtml = await renderMarkdown(md);
  } catch {
    aboutHtml = "<p>关于页面暂无内容</p>";
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* 关于版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <span className="text-vermilion font-semibold uppercase">
            DOSSIER · 编辑部名录
          </span>
          <span>EST. 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          主编档案 · ABOUT
        </h1>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          关于本报主编、创刊初衷与排版理念。
        </p>
      </header>

      {/* 主编立像与档案卡 (Editorial Profile Card) */}
      <div className="classified-box p-6 relative">
        <span className="corner-ornament corner-tl">◈</span>
        <span className="corner-ornament corner-tr">◈</span>
        <span className="corner-ornament corner-bl">◈</span>
        <span className="corner-ornament corner-br">◈</span>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-shrink-0">
            <AvatarDisplay
              author={siteConfig.author}
              fallback={siteConfig.avatar}
              className="w-24 h-24"
            />
          </div>

          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <h2 className="text-xl font-bold font-display text-ink">
                {siteConfig.author}
              </h2>
              <span className="text-xs font-mono text-vermilion uppercase tracking-wider font-semibold">
                / CHIEF EDITOR & CS STUDENT
              </span>
            </div>

            <p className="text-xs sm:text-sm font-serif text-ink-secondary leading-relaxed">
              {siteConfig.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-paper border border-rule hover:border-vermilion text-ink hover:text-vermilion transition-colors"
              >
                GITHUB &rarr;
              </a>
              <a
                href={siteConfig.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-paper border border-rule hover:border-vermilion text-ink hover:text-vermilion transition-colors"
              >
                LEETCODE &rarr;
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="px-2.5 py-1 bg-paper border border-rule hover:border-vermilion text-ink hover:text-vermilion transition-colors"
              >
                EMAIL &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 报纸印行指标 (Publication Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "刊登专稿", val: `${posts.length} 篇` },
          { label: "活字标签", val: `${tags.size} 组` },
          { label: "专栏门类", val: `${categories.size} 类` },
          { label: "印行时间", val: `${daysSince} 天` },
        ].map((item) => (
          <div
            key={item.label}
            className="border border-rule p-3 text-center bg-card"
          >
            <div className="text-lg sm:text-xl font-mono font-bold text-ink">
              {item.val}
            </div>
            <div className="text-[0.68rem] font-serif text-ink-muted mt-0.5">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* 档案 Markdown 正文 */}
      <div
        className="markdown-body border-t border-rule pt-6"
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      />
    </div>
  );
}

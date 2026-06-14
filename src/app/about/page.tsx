import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown-renderer";
import { AvatarDisplay } from "@/components/avatar-display";

export const metadata = { title: "关于" };

export default async function AboutPage() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  const categories = new Set(posts.map((p) => p.category).filter(Boolean));

  const firstPost = posts.reduce((earliest, p) =>
    p.date < earliest.date ? p : earliest,
    posts[0] || { date: new Date().toISOString().slice(0, 10) }
  );
  const daysSince = Math.floor(
    (Date.now() - new Date(firstPost.date).getTime()) / 86400000
  );

  let aboutHtml = "";
  try {
    const md = await fs.readFile(path.join(process.cwd(), "public", "about", "index.md"), "utf-8");
    aboutHtml = await renderMarkdown(md);
  } catch {
    aboutHtml = "<p>关于页面暂无内容</p>";
  }

  return (
    <article>
      <header className="mb-8 pb-5 border-b-2 border-border">
        <div className="text-[.6rem] text-accent font-mono tracking-wider mb-2">[关于]</div>
        <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">关于我</h1>
      </header>

      {/* 个人名片 */}
      <div className="border-2 border-border p-6 md:p-8 mb-8 bg-accent-glow/20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          <div className="flex-shrink-0">
            <AvatarDisplay author={siteConfig.author} fallback={siteConfig.avatar} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display text-xl font-bold text-text">{siteConfig.author}</h2>
            <p className="text-sm text-text-secondary mt-1">{siteConfig.description}</p>
            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-mono tracking-wider">GitHub</a>
              <a href={siteConfig.bilibili} target="_blank" rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-mono tracking-wider">Bilibili</a>
              <a href={siteConfig.leetcode} target="_blank" rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-mono tracking-wider">LeetCode</a>
            </div>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "文章", value: posts.length },
          { label: "标签", value: tags.size },
          { label: "分类", value: categories.size },
          { label: "运行", value: `${daysSince} 天` },
        ].map((s) => (
          <div key={s.label}
            className="border border-border p-3 text-center bg-accent-glow/10">
            <div className="text-xl md:text-2xl font-display font-bold text-accent">{s.value}</div>
            <div className="text-[.6rem] text-text-secondary font-mono tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 正文 — 从 Markdown 渲染 */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: aboutHtml }} />

      <div className="text-right text-border text-sm mt-8">■</div>
    </article>
  );
}

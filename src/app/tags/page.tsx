import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";

export const metadata = { title: "活字标签" };

export default async function TagsPage() {
  const posts = await getPosts();
  const tags = getAllTags(posts);

  return (
    <div className="w-full space-y-8">
      {/* 标签版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <span className="text-vermilion font-semibold uppercase">
            TYPE CASE · 活字字盘
          </span>
          <span>分类字模共 {tags.size} 组</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          活字字盘 · TAGS TRAY
        </h1>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          如同排字工人在铅字盘中检字，每个标签都是构筑技术与思想的一枚活字。
        </p>
      </header>

      {/* 活字铅块网格 (Typeset Box Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...tags.entries()].map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="classified-box p-3 group block transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-sm font-bold text-ink group-hover:text-vermilion transition-colors">
                {tag}
              </span>
              <span className="text-xs font-mono text-ink-muted">
                {count} 篇
              </span>
            </div>
            <div className="mt-2 text-[0.65rem] font-mono text-ink-muted border-t border-rule pt-1 flex items-center justify-between">
              <span>TYPE #{tag.charCodeAt(0) % 100}</span>
              <span className="group-hover:text-vermilion">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

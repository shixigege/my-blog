import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { readingTime } from "@/lib/posts";

export const metadata = { title: "专栏文章" };

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="w-full space-y-6">
      {/* 专栏版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <span className="text-vermilion font-semibold uppercase">
            SECTION B · 专栏总览
          </span>
          <span>共收录 {posts.length} 篇专稿</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          专栏文集 · ARTICLES
        </h1>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          汇集所有技术探索、设计笔记与日常随感。
        </p>
      </header>

      {/* 文章索引列表 */}
      {posts.length === 0 ? (
        <div className="py-20 text-center text-ink-muted font-serif">
          暂无专栏文章
        </div>
      ) : (
        <div className="divide-y divide-rule">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="py-5 group transition-colors hover:bg-card/50 px-2 sm:px-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono text-ink-muted mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-ink-secondary font-semibold">
                    {post.date}
                  </span>
                  {post.category && (
                    <>
                      <span>/</span>
                      <Link
                        href={`/tags/${encodeURIComponent(post.category)}`}
                        className="text-vermilion font-serif hover:underline"
                      >
                        {post.category}
                      </Link>
                    </>
                  )}
                </div>
                <span>约 {readingTime(post.summary || "") * 3} 分钟</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold leading-snug">
                <Link
                  href={`/blog/${post.slug}`}
                  className="editorial-link hover:text-vermilion"
                >
                  {post.title}
                </Link>
              </h2>

              {post.summary && (
                <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-2 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-[0.7rem] font-serif">
                  <span className="text-ink-muted font-mono">TAGS:</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="px-1.5 py-0.5 bg-paper border border-rule text-ink-secondary hover:border-vermilion transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

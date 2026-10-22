import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getArchive } from "@/lib/posts";

export const metadata = { title: "合订归档" };

export default async function ArchivePage() {
  const posts = await getPosts();
  const archive = getArchive(posts);

  return (
    <div className="w-full space-y-8">
      {/* 归档版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <span className="text-vermilion font-semibold uppercase">
            CHRONICLE · 历史合订本
          </span>
          <span>历史印行共 {posts.length} 篇</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          编年合订 · ARCHIVE
        </h1>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          按年月编排的全部刊登记录，见证思维沉淀与技术成长轨迹。
        </p>
      </header>

      {/* 编年列表 */}
      <div className="space-y-8">
        {[...archive.entries()].map(([month, monthPosts]) => {
          const [y, m] = month.split("-");
          return (
            <section key={month} id={month} className="space-y-3">
              {/* 年月分栏横标 */}
              <div className="flex items-center gap-3 border-b-2 border-rule pb-1.5">
                <span className="font-mono text-xs text-vermilion font-bold">
                  ◆
                </span>
                <h2 className="text-lg font-bold font-serif text-ink">
                  {y} 年 {parseInt(m, 10)} 月卷
                </h2>
                <span className="text-xs font-mono text-ink-muted">
                  / 共刊出 {monthPosts.length} 篇
                </span>
              </div>

              {/* 当月文章列表 */}
              <div className="divide-y divide-rule border-l border-rule pl-4 sm:pl-6 ml-2 space-y-0">
                {monthPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group hover:bg-card/40 px-2 transition-colors"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-xs font-mono text-ink-muted flex-shrink-0">
                        {post.date.slice(5)}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-serif text-sm sm:text-base font-semibold text-ink group-hover:text-vermilion transition-colors truncate"
                      >
                        {post.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                      {post.category && (
                        <span className="text-[0.68rem] font-serif text-ink-secondary px-1.5 py-0.5 border border-rule bg-paper">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

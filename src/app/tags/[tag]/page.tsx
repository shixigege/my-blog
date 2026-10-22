import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getAllTags, readingTime } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  return [...tags.keys()].map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return { title: `标签 · ${decodeURIComponent(tag)}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = (await getPosts()).filter((p) => p.tags?.includes(decoded));

  return (
    <div className="w-full space-y-8">
      {/* 专题版头 */}
      <header className="border-b-2 border-rule-strong pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
          <Link
            href="/tags"
            className="text-vermilion hover:underline font-semibold uppercase"
          >
            &larr; 返回全部活字盘
          </Link>
          <span>共收录 {posts.length} 篇专稿</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xl sm:text-2xl font-mono text-vermilion">#</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {decoded}
          </h1>
        </div>
        <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1">
          归入该活字标签的所有专栏文章索引。
        </p>
      </header>

      {/* 专题文章列表 */}
      {posts.length === 0 ? (
        <div className="py-20 text-center text-ink-muted font-serif">
          该专题下暂无文章
        </div>
      ) : (
        <div className="divide-y divide-rule">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="py-4 px-2 sm:px-4 group hover:bg-card/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
                <span>{post.date}</span>
                <span>约 {readingTime(post.summary || "") * 3} 分钟</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="editorial-link hover:text-vermilion"
                >
                  {post.title}
                </Link>
              </h2>
              {post.summary && (
                <p className="text-xs sm:text-sm font-serif text-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

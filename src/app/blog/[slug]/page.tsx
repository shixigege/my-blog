import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown-renderer";
import { readingTime, wordCount, type Post } from "@/lib/posts";
import { ArticleEnhancer } from "@/components/article-enhancer";

export async function generateStaticParams() {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "blogs", "index.json"),
      "utf-8"
    );
    const posts: Post[] = JSON.parse(raw);
    return posts.filter((p) => !p.hidden).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "blogs", slug, "config.json"),
      "utf-8"
    );
    const post = JSON.parse(raw);
    return { title: post.title, description: post.summary };
  } catch {
    return { title: "专稿详情" };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Post | null = null;
  let html = "";
  let allPosts: Post[] = [];

  try {
    const [indexRaw, configRaw, mdRaw] = await Promise.all([
      fs.readFile(path.join(process.cwd(), "public", "blogs", "index.json"), "utf-8"),
      fs.readFile(path.join(process.cwd(), "public", "blogs", slug, "config.json"), "utf-8"),
      fs.readFile(path.join(process.cwd(), "public", "blogs", slug, "index.md"), "utf-8"),
    ]);

    allPosts = JSON.parse(indexRaw).filter((p: Post) => !p.hidden);
    post = { ...JSON.parse(configRaw), slug, content: mdRaw };
    html = await renderMarkdown(mdRaw);
  } catch (e) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const wc = post?.content ? wordCount(post.content) : 0;
  const rt = post?.content ? readingTime(post.content) : 1;

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-2">
      {/* ===== 专稿报头栏目 ===== */}
      <header className="border-b-2 border-rule-strong pb-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="bg-vermilion text-paper-pure px-2 py-0.5 font-semibold text-[0.68rem] uppercase">
              本报专稿 · FEATURE
            </span>
            {post.category && (
              <>
                <span>/</span>
                <Link
                  href={`/tags/${encodeURIComponent(post.category)}`}
                  className="text-ink-secondary hover:text-vermilion font-serif"
                >
                  {post.category}
                </Link>
              </>
            )}
          </div>
          <span>{post.date}</span>
        </div>

        {/* 专稿大标题 */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
          {post.title}
        </h1>

        {/* 报纸副标题 / 导语框 */}
        {post.summary && (
          <div className="bg-card border-l-4 border-vermilion p-3.5 sm:p-4 text-ink-secondary font-serif italic text-sm sm:text-base leading-relaxed">
            “{post.summary}”
          </div>
        )}

        {/* 专稿元信息栏 */}
        <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-2 border-t border-rule">
          <div className="flex items-center gap-3">
            <span>字数：{wc} 字</span>
            <span>·</span>
            <span>约 {rt} 分钟阅读</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 font-serif text-[0.72rem]">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${encodeURIComponent(t)}`}
                  className="text-ink-muted hover:text-vermilion"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 专稿封面大插图 (若有) */}
      {post.cover && (
        <div className="border border-rule overflow-hidden my-4">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full max-h-96 object-cover filter contrast-[1.05]"
          />
        </div>
      )}

      {/* ===== 正文渲染 (带轻量代码复制增强) ===== */}
      <ArticleEnhancer>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ArticleEnhancer>

      {/* 终卷章印 */}
      <div className="flex items-center justify-center gap-3 py-6 select-none">
        <div className="w-16 h-[1px] bg-rule" />
        <span className="text-xs font-mono tracking-widest text-ink-muted uppercase">
          ◈ 本 篇 完 ◈
        </span>
        <div className="w-16 h-[1px] bg-rule" />
      </div>

      {/* ===== 上下篇导读 (双栏报刊版位) ===== */}
      <nav className="rule-double-top pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="classified-box p-3.5 group block transition-colors"
          >
            <span className="text-[0.68rem] font-mono text-ink-muted block mb-1">
              &larr; 前期专稿 PREVIOUS
            </span>
            <span className="text-sm font-serif font-bold text-ink group-hover:text-vermilion transition-colors line-clamp-1">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="p-3.5 border border-dashed border-rule text-xs font-mono text-ink-muted text-center flex items-center justify-center">
            [ 已是首期专稿 ]
          </div>
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="classified-box p-3.5 group block text-right transition-colors"
          >
            <span className="text-[0.68rem] font-mono text-ink-muted block mb-1">
              后继专稿 NEXT &rarr;
            </span>
            <span className="text-sm font-serif font-bold text-ink group-hover:text-vermilion transition-colors line-clamp-1">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="p-3.5 border border-dashed border-rule text-xs font-mono text-ink-muted text-center flex items-center justify-center">
            [ 已是最新一期 ]
          </div>
        )}
      </nav>
    </article>
  );
}

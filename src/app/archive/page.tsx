import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getArchive } from "@/lib/posts";

export const metadata = { title: "归档" };

export default async function ArchivePage() {
  const posts = await getPosts();
  const archive = getArchive(posts);

  return (
    <article>
      <header className="mb-8 pb-5 border-b-2 border-border">
        <div className="text-[.6rem] text-accent font-mono tracking-wider mb-2">[归档]</div>
        <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">归档</h1>
        <p className="text-xs text-text-secondary mt-2">共 {posts.length} 篇文章</p>
      </header>

      {[...archive.entries()].map(([month, monthPosts]) => {
        const [y, m] = month.split("-");
        return (
          <section key={month} id={month} className="mb-8">
            <h2 className="text-base font-display font-bold text-text mb-3 pb-1.5 border-b border-border">
              {y} 年 {parseInt(m)} 月
              <span className="text-xs text-text-secondary font-normal ml-2 font-mono">{monthPosts.length} 篇</span>
            </h2>
            <div className="space-y-0">
              {monthPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}
                  className="flex items-center justify-between py-2 px-2 border-b border-border hover:bg-accent-glow transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm text-text group-hover:text-accent transition-colors truncate">{p.title}</span>
                    {p.category && <span className="text-[.55rem] text-accent font-mono tracking-wider flex-shrink-0 border border-accent/30 px-1.5 py-0.5">{p.category}</span>}
                  </div>
                  <span className="text-xs text-text-secondary font-mono flex-shrink-0 ml-4">{p.date.slice(8)} 日</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="text-right text-border text-sm mt-8">■</div>
    </article>
  );
}

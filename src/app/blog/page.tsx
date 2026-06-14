import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { Sidebar } from "@/components/sidebar";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata = { title: "博客" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="newspaper-grid">
      <div className="min-w-0">
        <header className="mb-8 pb-5 border-b-2 border-border">
          <div className="text-[.6rem] text-accent font-mono tracking-wider mb-2">[博客]</div>
          <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">全部文章</h1>
        </header>

        {posts.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">暂无文章</p>
        ) : (
          <div className="space-y-0">
            {posts.map((p) => (
              <ScrollReveal key={p.slug}>
                <Link href={`/blog/${p.slug}`}
                  className="flex items-center justify-between py-3 px-3 border-b border-border hover:bg-accent-glow transition-colors group">
                  {p.cover && (
                    <img src={p.cover} alt="" className="w-14 h-10 object-cover border border-border flex-shrink-0 mr-3" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[.58rem] text-text-secondary font-mono tracking-wider mb-0.5">
                      {p.category && <span className="text-[#5A4A3A]">[{p.category}]</span>}
                    </div>
                    <h2 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">{p.title}</h2>
                    {p.summary && <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{p.summary}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <Link href={`/write?slug=${p.slug}`}
                      className="text-[.55rem] font-mono text-accent hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      编辑
                    </Link>
                    <span className="text-xs text-text-secondary font-mono">{p.date}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}

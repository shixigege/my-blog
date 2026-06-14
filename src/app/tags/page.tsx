import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";

export const metadata = { title: "标签" };

export default async function TagsPage() {
  const posts = await getPosts();
  const tags = getAllTags(posts);

  return (
    <article>
      <header className="mb-8 pb-5 border-b-2 border-border">
        <div className="text-[.6rem] text-[#5A4A3A] font-mono tracking-wider mb-2">[标签]</div>
        <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">标签</h1>
        <p className="text-xs text-text-secondary mt-2">{tags.size} 个标签</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[...tags.entries()].map(([tag, count]) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}
            className="px-3 py-1.5 border border-border hover:border-accent transition-colors text-sm group">
            <span className="text-text group-hover:text-accent transition-colors">{tag}</span>
            <span className="ml-1.5 text-xs text-border">{count}</span>
          </Link>
        ))}
      </div>

      <div className="text-right text-border text-sm mt-8">■</div>
    </article>
  );
}

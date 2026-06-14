import Link from "next/link";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
  return [...tags.keys()].map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = (await getPosts()).filter((p) => p.tags?.includes(decoded));

  return (
    <article>
      <header className="mb-8 pb-5 border-b-2 border-border">
        <div className="text-[.6rem] text-[#5A4A3A] font-mono tracking-wider mb-2">[标签]</div>
        <h1 className="font-display text-2xl md:text-3xl text-text font-bold tracking-wide">#{decoded}</h1>
        <p className="text-xs text-text-secondary mt-2">{posts.length} 篇文章</p>
      </header>

      <div className="space-y-1">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="flex items-center justify-between py-2.5 px-3 border-b border-border hover:bg-accent-glow transition-colors group">
            <span className="text-sm text-text group-hover:text-accent transition-colors">{p.title}</span>
            <span className="text-xs text-text-secondary font-mono flex-shrink-0 ml-4">{p.date}</span>
          </Link>
        ))}
      </div>

      <div className="text-right text-border text-sm mt-8">■</div>
    </article>
  );
}

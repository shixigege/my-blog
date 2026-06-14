"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getPost, type Post, readingTime, wordCount } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown-renderer";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [nav, setNav] = useState<{ prev: Post | null; next: Post | null }>({ prev: null, next: null });
  const ref = useRef<HTMLDivElement>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await getPost(slug);
        setPost(p as Post);
        setHtml(await renderMarkdown(p.content));
        const r = await fetch("/blogs/index.json");
        if (r.ok) { const all: Post[] = await r.json(); const i = all.findIndex(a => a.slug === slug); setNav({ prev: i > 0 ? all[i - 1] : null, next: i < all.length - 1 ? all[i + 1] : null }); }
      } catch (e: any) { setErr(e.message); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const b = document.createElement("button");
      b.textContent = "Copy";
      b.className = "copy-btn absolute right-2 top-2 text-xs text-text-secondary hover:text-accent px-2 py-1 bg-[#1A1410] border border-[#3A3024] transition-colors font-mono";
      b.onclick = () => { navigator.clipboard.writeText(pre.textContent || "").then(() => { b.textContent = "Copied!"; setTimeout(() => b.textContent = "Copy", 1500); }); };
      pre.style.position = "relative"; pre.appendChild(b);
    });
  }, [html]);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setAuthed(d.authed)).catch(() => {});
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" /></div>;
  if (err || !post) return <div className="py-32 text-center"><h1 className="text-xl text-text">文章未找到</h1><p className="mt-2 text-text-secondary">{err}</p></div>;

  const wc = post.content ? wordCount(post.content) : 0;
  const rt = post.content ? readingTime(post.content) : 1;

  return (
    <article className="max-w-[720px] mx-auto">
      {/* Cover image */}
      {post.cover && (
        <div className="mb-8 -mx-4 md:-mx-0">
          <img src={post.cover} alt={post.title}
            className="w-full max-h-80 object-cover border border-border" />
        </div>
      )}

      {/* Article header */}
      <header className="mb-10 pb-8 border-b border-border">
        <div className="text-[.6rem] text-text-secondary font-mono tracking-wider mb-4 flex items-center gap-3 flex-wrap">
          {post.category && <span className="font-semibold text-[#5A4A3A]">{post.category}</span>}
          <span className="text-border">|</span>
          <span>{post.date}</span>
          <span className="text-border">|</span>
          <span>{wc} 字</span>
          <span className="text-border">|</span>
          <span>约 {rt} 分钟</span>
          <span className="text-border">|</span>
          <Link href={`/write?slug=${post.slug}`} className="text-accent hover:underline">编辑</Link>
          {authed && (<><span className="text-border">|</span>
          <button onClick={async () => {
            if (!confirm(`确定删除「${post.title}」？此操作不可撤销。`)) return;
            try {
              const r = await fetch("/api/delete-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: post.slug }) });
              if (!r.ok) { const d = await r.json(); alert(`删除失败: ${d.error}`); return; }
              window.location.href = "/";
            } catch { alert("删除失败，请重试"); }
          }} className="text-red-600/70 hover:text-red-600 transition-colors text-sm">删除</button></>)}
        </div>
        <h1 className="font-display text-2xl md:text-[1.75rem] text-text leading-tight font-black tracking-wide">
          {post.title}
        </h1>
        {post.tags && (
          <div className="mt-4 flex gap-3 flex-wrap">
            {post.tags.map((t) => (
              <Link key={t} href={`/tags/${encodeURIComponent(t)}`}
                className="text-[.6rem] text-text-secondary font-mono tracking-wider hover:text-accent transition-colors">
                #{t}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Article body */}
      <div ref={ref} className="prose prose-article" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Article end */}
      <div className="text-center text-border text-[.6rem] tracking-[.5em] mt-12 mb-6 select-none">◆ ◆ ◆</div>

      {/* Navigation */}
      <nav className="flex justify-between text-sm pt-6 border-t-2 border-double border-border">
        {nav.prev ? (
          <Link href={`/blog/${nav.prev.slug}`} className="text-text-secondary hover:text-accent transition-colors max-w-[45%]">
            <span className="text-[.6rem] font-mono tracking-wider block text-border mb-1">← 上一篇</span>
            <span className="text-xs">{nav.prev.title}</span>
          </Link>
        ) : <span />}
        {nav.next ? (
          <Link href={`/blog/${nav.next.slug}`} className="text-text-secondary hover:text-accent transition-colors text-right max-w-[45%]">
            <span className="text-[.6rem] font-mono tracking-wider block text-border mb-1">下一篇 →</span>
            <span className="text-xs">{nav.next.title}</span>
          </Link>
        ) : <span />}
      </nav>
    </article>
  );
}

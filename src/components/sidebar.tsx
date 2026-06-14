"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllTags, getArchive, type Post } from "@/lib/posts";

export function Sidebar() {
  const [tags, setTags] = useState<[string, number][]>([]);
  const [archive, setArchive] = useState<[string, number][]>([]);
  const [today, setToday] = useState({ y: "", m: "", d: "", w: "" });

  useEffect(() => {
    fetch("/blogs/index.json").then(r => r.json()).then((posts: Post[]) => {
      setTags([...getAllTags(posts).entries()].slice(0, 10));
      const arch = getArchive(posts);
      setArchive([...arch.entries()].slice(0, 6).map(([k, v]) => [k, v.length]));
    }).catch(() => {});
    const n = new Date();
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    setToday({ y: String(n.getFullYear()), m: String(n.getMonth() + 1), d: String(n.getDate()), w: days[n.getDay()] });
  }, []);

  return (
    <aside className="space-y-8">
      <div className="sticky top-4 space-y-8">

        {/* 日历 */}
        <section>
          <h3 className="font-display text-[.8rem] font-semibold text-text-secondary tracking-widest uppercase border-b border-border pb-2 mb-3">
            日 历
          </h3>
          <div className="border-2 border-border p-5 text-center bg-accent-glow/30">
            <div className="text-[.85rem] text-text-secondary font-mono tracking-wider">
              {today.y} 年 {today.m} 月
            </div>
            <div className="text-[2.8rem] font-display font-bold text-text leading-none mt-2 tracking-wide">
              {today.d}
            </div>
            <div className="text-[.9rem] text-accent font-mono tracking-wider mt-1 font-semibold">
              星期{today.w}
            </div>
            <div className="mt-3 pt-3 border-t-2 border-double border-border text-[.65rem] text-text-secondary font-mono tracking-[.2em]">
              今日宜 · 读写
            </div>
          </div>
        </section>

        {/* Tags */}
        {tags.length > 0 && (
          <section>
            <h3 className="font-display text-[.8rem] font-semibold text-text-secondary tracking-widest uppercase border-b border-border pb-2 mb-4">
              栏目
            </h3>
            <ul className="space-y-0">
              {tags.map(([t, c]) => (
                <li key={t} className="border-b border-border last:border-0">
                  <Link href={`/tags/${encodeURIComponent(t)}`}
                    className="flex justify-between text-sm text-text-secondary hover:text-accent transition-colors py-3">
                    <span className="text-base">{t}</span>
                    <span className="text-text-secondary text-sm">{c}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Archive */}
        {archive.length > 0 && (
          <section>
            <h3 className="font-display text-[.8rem] font-semibold text-text-secondary tracking-widest uppercase border-b border-border pb-2 mb-4">
              归档
            </h3>
            <ul className="space-y-0">
              {archive.map(([k, c]) => {
                const [y, m] = k.split("-");
                return (
                  <li key={k} className="border-b border-border last:border-0">
                    <Link href={`/archive#${k}`}
                      className="flex justify-between text-sm text-text-secondary hover:text-accent transition-colors py-3">
                      <span className="text-base">{y} 年 {parseInt(m)} 月</span>
                      <span className="text-text-secondary text-sm">{c}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Friends */}
        <section>
          <h3 className="font-display text-[.8rem] font-semibold text-text-secondary tracking-widest uppercase border-b border-border pb-2 mb-4">
            友链
          </h3>
          <Link href="/friends" className="text-base text-text-secondary hover:text-accent transition-colors">
            查看全部 →
          </Link>
        </section>

      </div>
    </aside>
  );
}

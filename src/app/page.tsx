import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/posts-server";
import { wordCount, readingTime } from "@/lib/posts";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Live2DCharacter } from "@/components/dynamic-live2d";

// ——— placeholder content for when there aren't enough real posts ———
const storyPlaceholders = [
  { slug: "", title: "排版：活字印刷留给数字时代的遗产", category: "技术笔记", summary: "谷登堡未必能料到，他在十五世纪摆弄的那些铅字，会在五百年后以一种他完全无法理解的方式影响着数十亿人的阅读。字距、行高、栏宽——这些参数在铅字时代是物理约束，在数字时代却成了设计选择。" },
  { slug: "", title: '原研哉的"白"：空空荡荡，包罗万象', category: "阅读笔记", summary: "白不是一种颜色，而是一种容纳性。一张白纸不是空的，它包含着一切尚未落笔的想法。MUJI的设计之所以让人安静，不是因为极简，而是那些空白给了物品呼吸的空间。" },
  { slug: "", title: "雨夜翻检旧信", category: "随感", summary: "昨夜下雨，翻出一只旧铁盒，里面是高中时代和几个笔友的通信。纸已经泛黄，有的地方被水渍洇开了墨迹。那时候没有微信和邮件，写一封信要等一周才收到回信。" },
];

export default async function HomePage() {
  const posts = await getPosts();
  const headline = posts[0] || null;
  const rest = posts.slice(1);

  // Stories: use real posts, then pad with placeholders
  const storyPosts = rest.slice(0, 3);
  const stories: { slug: string; title: string; category: string; summary: string; cover?: string }[] = storyPlaceholders.map((ph, i) => {
    const real = storyPosts[i];
    return real ? { slug: real.slug, title: real.title, category: real.category || "随笔", summary: real.summary || "", cover: real.cover } : ph;
  });

  return (
    <div className="newspaper-grid">
      {/* ===== MAIN COLUMN ===== */}
      <div className="min-w-0 space-y-8">

        {/* ——— 1. HEADLINE ——— */}
        {headline && (
          <ScrollReveal>
            <article>
              <p className="text-[.62rem] text-text-secondary font-mono tracking-wider mb-3">
                <span className="text-accent font-semibold">[头条]</span>
                <span className="mx-2 text-border">|</span>
                {headline.date}
                {headline.content ? <><span className="mx-2 text-border">|</span>{wordCount(headline.content)} 字</> : null}
              </p>
              {headline.cover && (
                <Link href={`/blog/${headline.slug}`} className="block mb-5">
                  <img src={headline.cover} alt={headline.title}
                    className="w-full max-h-72 object-cover border border-border hover:opacity-90 transition-opacity" />
                </Link>
              )}
              <h2 className="font-display text-[1.65rem] md:text-[2rem] font-black leading-[1.1] mb-4 tracking-wide text-text">
                <Link href={`/blog/${headline.slug}`} className="hover:text-accent transition-colors">
                  {headline.title}
                </Link>
              </h2>
              {headline.summary && (
                <div className="columns-1 md:columns-2 gap-8 text-sm md:text-[.88rem] leading-[1.9] text-text-secondary">
                  <p className="mb-3">{headline.summary}</p>
                  <p className="mb-3">点击标题阅读全文...</p>
                </div>
              )}
              <div className="mt-5 border-t border-border" />
            </article>
          </ScrollReveal>
        )}

        {!headline && (
          <ScrollReveal>
            <article>
              <p className="text-[.62rem] text-text-secondary font-mono tracking-wider mb-3">
                <span className="text-accent font-semibold">[头条]</span>
              </p>
              <h2 className="font-display text-[1.65rem] md:text-[2rem] font-black leading-[1.1] mb-4 tracking-wide text-text">
                欢迎来到 {siteConfig.title}
              </h2>
              <div className="columns-1 md:columns-2 gap-8 text-sm md:text-[.88rem] leading-[1.9] text-text-secondary">
                <p className="mb-3">这是您的第一篇占位文章。在 public/blogs/ 中添加 Markdown 文章后，这里会自动显示最新文章。报纸风格博客采用了复古黄纸色调、多栏网格排版。</p>
                <p className="mb-3">您可以撰写技术笔记、文艺随笔、阅读心得等各类内容——每一篇都会以报纸头条的形式呈现。</p>
              </div>
              <div className="mt-5 border-t border-border" />
            </article>
          </ScrollReveal>
        )}

        {/* ——— 2. THREE STORIES (asymmetric: wider first) ——— */}
        <div>
          <div className="story-grid-3">
            {stories.map((p, i) => (
              <ScrollReveal key={`story-${i}`} delay={i * 120}>
                <article className="newspaper-card">
                  {p.cover && (
                    <img src={p.cover} alt={p.title} className="w-full h-28 object-cover border border-border mb-3" />
                  )}
                  <p className="text-[.6rem] text-text-secondary font-mono tracking-wider mb-2">
                    <span className="font-semibold text-[#5A4A3A]">{p.category}</span>
                  </p>
                  <h3>
                    {p.slug ? (
                      <Link href={`/blog/${p.slug}`} className="text-text hover:text-accent transition-colors">{p.title}</Link>
                    ) : (
                      <span className="text-text">{p.title}</span>
                    )}
                  </h3>
                  <p className="text-xs md:text-[.8rem] text-text-secondary leading-relaxed">
                    {p.summary}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-5 border-t border-border" />
        </div>

        {/* ——— 3. Live2D 报童 ——— */}
        <div>
          <div className="flex justify-center py-2">
            <Live2DCharacter />
          </div>
          <div className="mt-5 border-t border-border" />
        </div>

        {/* ——— 4. COLUMN (only if enough real posts) ——— */}
        {rest.length >= 4 && (() => {
          const col = rest[3];
          return (
            <ScrollReveal key={col.slug}>
              <article className="newspaper-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-[3px] h-5 bg-accent" />
                  <span className="text-[.65rem] text-text-secondary font-mono tracking-widest uppercase">
                    <span className="text-accent font-semibold">专栏</span>
                  </span>
                </div>
                <h3 className="font-display text-base md:text-lg font-bold leading-snug mb-3 text-text">
                  <Link href={`/blog/${col.slug}`} className="hover:text-accent transition-colors">
                    {col.title}
                  </Link>
                </h3>
                <p className="text-sm md:text-[.85rem] text-text-secondary leading-relaxed">
                  {col.summary}
                </p>
                <Link
                  href={`/blog/${col.slug}`}
                  className="inline-block text-xs text-text-secondary font-mono tracking-wider mt-3 hover:text-accent transition-colors"
                >
                  阅读全文 →
                </Link>
              </article>
            </ScrollReveal>
          );
        })()}

      </div>

      {/* ===== 右侧副刊栏 ===== */}
      <div className="hidden md:block space-y-6 pt-4 border-l border-border-light pl-6">
        {/* 羽毛笔 */}
        <div className="text-center">
          <svg viewBox="0 0 100 160" className="w-20 h-28 mx-auto" fill="none" stroke="var(--accent)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 8 Q 45 70 48 145" />
            <path d="M 49 25 Q 20 28 8 32" />
            <path d="M 48 42 Q 15 48 6 56" />
            <path d="M 48 60 Q 18 68 10 76" />
            <path d="M 48 78 Q 25 86 18 94" />
            <path d="M 48 98 Q 32 104 28 110" />
            <path d="M 51 25 Q 80 28 92 32" />
            <path d="M 52 42 Q 85 48 94 56" />
            <path d="M 52 60 Q 82 68 90 76" />
            <path d="M 52 78 Q 75 86 82 94" />
            <path d="M 52 98 Q 68 104 72 110" />
            <path d="M 47 138 L 49 152 L 50 155 L 51 152 L 53 138" />
            <circle cx="50" cy="158" r="1.5" />
          </svg>
        </div>

        <div className="ornament-rule"><span className="ornament">— ✦ 副 刊 ✦ —</span></div>

        {/* 短讯卡片 */}
        {stories.slice(0, 3).map((p, i) => (
          <div key={i} className="supplement-card">
            <div className="sup-title">
              {p.slug ? (
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              ) : (
                <span>{p.title}</span>
              )}
            </div>
            <div className="sup-meta">{p.category}</div>
          </div>
        ))}

        <div className="ornament-rule"><span className="ornament">— ✦ —</span></div>

        {/* 名言 */}
        <div className="border-l-2 border-accent/25 pl-3 py-1">
          <p className="text-[.9rem] text-text leading-relaxed italic">
            &ldquo;笔是思想的舌头。&rdquo;
          </p>
          <p className="text-[.65rem] text-text-secondary mt-1 font-mono tracking-wider">—— 塞万提斯</p>
        </div>

        {/* 底部装饰 */}
        <div className="text-center text-border text-[.55rem] tracking-[.4em] select-none">
          ✦ ✦ ✦
        </div>
      </div>
    </div>
  );
}

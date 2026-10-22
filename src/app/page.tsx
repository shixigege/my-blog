import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getPosts } from "@/lib/posts-server";
import { getAllTags, readingTime, wordCount } from "@/lib/posts";
import { AvatarDisplay } from "@/components/avatar-display";
import { DynamicNewsboy } from "@/components/dynamic-live2d";
import { promises as fs } from "fs";
import path from "path";

async function getFriends() {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "friends", "index.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();
  const headline = posts[0] || null;
  const features = posts.slice(1, 3);
  const tagsMap = getAllTags(posts);
  const topTags = Array.from(tagsMap.entries()).slice(0, 8);
  const friends = await getFriends();

  return (
    <div className="w-full space-y-8">
      {/* ===== 方案 A：主体双栏报刊网格 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ----- 左主栏 (70% 宽，深度阅读与头条) ----- */}
        <div className="lg:col-span-8 lg:pr-6 lg:border-r border-rule space-y-8">
          {/* 头版头条 (Lead Story) */}
          {headline ? (
            <article className="space-y-4">
              {/* 电头与栏目 */}
              <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-ink-muted border-b border-rule pb-2">
                <span className="bg-vermilion text-paper-pure px-2 py-0.5 font-semibold text-[0.7rem] uppercase">
                  头版特稿 · LEAD DISPATCH
                </span>
                <span>{headline.date}</span>
                {headline.category && (
                  <>
                    <span>/</span>
                    <Link
                      href={`/tags/${encodeURIComponent(headline.category)}`}
                      className="text-vermilion hover:underline font-serif"
                    >
                      {headline.category}
                    </Link>
                  </>
                )}
              </div>

              {/* 大标题 */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
                <Link
                  href={`/blog/${headline.slug}`}
                  className="editorial-link hover:text-vermilion transition-colors"
                >
                  {headline.title}
                </Link>
              </h2>

              {/* 头条导语框 */}
              {headline.summary && (
                <div className="bg-card border-l-4 border-vermilion p-3 sm:p-4 text-ink-secondary text-sm sm:text-base font-serif italic leading-relaxed">
                  “{headline.summary}”
                </div>
              )}

              {/* 头条封面图 (若有) */}
              {headline.cover && (
                <div className="w-full overflow-hidden border border-rule my-3 relative">
                  <img
                    src={headline.cover}
                    alt={headline.title}
                    className="w-full h-48 sm:h-64 object-cover filter contrast-[1.05] grayscale-[0.25] hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="text-[0.65rem] font-mono text-ink-muted text-right py-1 px-2 bg-paper border-t border-rule">
                    ▲ 本报插图配图
                  </div>
                </div>
              )}

              {/* 正文摘要与阅读引导 */}
              <div className="text-ink-secondary font-serif text-sm sm:text-base leading-relaxed text-justify space-y-2">
                <p>
                  {headline.summary ||
                    "这是一篇发布于本站的深度技术与思考札记。点击下方链接即可阅读全文，探讨代码架构、系统设计与数字时代的生活方式。"}
                </p>
              </div>

              {/* 头条底栏 */}
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-3 border-t border-rule">
                <div className="flex items-center gap-3">
                  <span>约 {readingTime(headline.summary || "") * 3} 分钟阅读</span>
                  <span>·</span>
                  <span>主编特撰</span>
                </div>
                <Link
                  href={`/blog/${headline.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-vermilion hover:underline text-xs tracking-wider"
                >
                  阅读专稿全文 &rarr;
                </Link>
              </div>
            </article>
          ) : (
            <div className="p-8 text-center border border-rule bg-card">
              <p className="font-serif text-ink-muted">暂无头版专稿发布</p>
            </div>
          )}

          {/* 双列特写 (Two-column Features) */}
          {features.length > 0 && (
            <div className="pt-6 border-t-2 border-rule-strong space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold tracking-widest text-ink uppercase font-mono flex items-center gap-2">
                  <span className="text-vermilion">◈</span>
                  <span>二版要闻 · FEATURES</span>
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-mono text-ink-muted hover:text-vermilion transition-colors"
                >
                  查看全部文章 ({posts.length}) &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((post, idx) => (
                  <article
                    key={post.slug}
                    className={`space-y-2.5 ${
                      idx === 0 ? "sm:pr-4 sm:border-r border-rule" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[0.7rem] font-mono text-ink-muted">
                      <span>{post.date}</span>
                      {post.category && (
                        <>
                          <span>/</span>
                          <span className="text-ink-secondary font-serif">
                            {post.category}
                          </span>
                        </>
                      )}
                    </div>
                    <h4 className="text-lg font-bold leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="editorial-link hover:text-vermilion"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    {post.summary && (
                      <p className="text-xs text-ink-secondary font-serif line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                    <div className="pt-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-mono text-vermilion hover:underline inline-flex items-center gap-1"
                      >
                        阅读全文 &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ----- 右副栏 (30% 宽，主笔档案 + 罗小黑特派报童 + 铅字标签) ----- */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 主笔立像 (Author Profile / Byline) */}
          <div className="classified-box p-5 text-center relative">
            <span className="corner-ornament corner-tl">◈</span>
            <span className="corner-ornament corner-tr">◈</span>
            <span className="corner-ornament corner-bl">◈</span>
            <span className="corner-ornament corner-br">◈</span>

            <div className="flex flex-col items-center gap-3">
              <Link href="/about" className="block group">
                <AvatarDisplay
                  author={siteConfig.author}
                  fallback={siteConfig.avatar}
                  className="w-20 h-20 transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
              <div>
                <h3 className="text-base font-bold tracking-wider font-display">
                  {siteConfig.author}
                </h3>
                <p className="text-xs font-serif text-ink-secondary mt-0.5">
                  主编 · 计算机专业大学生
                </p>
              </div>

              <p className="text-xs font-serif text-ink-muted leading-relaxed max-w-xs border-t border-b border-rule py-2 px-1">
                “代码是沉着的诗行，屏幕是数字时代的油墨与纸张。”
              </p>

              {/* 社交极客入口 */}
              <div className="flex items-center gap-4 text-xs font-mono text-ink-secondary pt-1">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-vermilion transition-colors inline-flex items-center gap-1"
                  title="GitHub 仓库"
                >
                  <span>GITHUB</span>
                </a>
                <span>·</span>
                <a
                  href={siteConfig.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-vermilion transition-colors inline-flex items-center gap-1"
                  title="LeetCode 题解"
                >
                  <span>LEETCODE</span>
                </a>
                <span>·</span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-vermilion transition-colors inline-flex items-center gap-1"
                  title="发送邮件"
                >
                  <span>MAIL</span>
                </a>
              </div>
            </div>
          </div>

          {/* 罗小黑特派报童 (Newsboy) */}
          <DynamicNewsboy />

          {/* 活字字盘 / 热门标签 (Tags Tray) */}
          <div className="classified-box p-4 relative">
            <span className="corner-ornament corner-tl">◈</span>
            <span className="corner-ornament corner-tr">◈</span>
            <span className="corner-ornament corner-bl">◈</span>
            <span className="corner-ornament corner-br">◈</span>

            <div className="flex items-center justify-between pb-2 mb-3 border-b border-rule">
              <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
                ◈ 活字字盘 · TAGS ◈
              </span>
              <Link
                href="/tags"
                className="text-[0.68rem] font-mono text-ink-muted hover:text-vermilion"
              >
                全部字盘 &rarr;
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {topTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-serif px-2 py-1 bg-paper border border-rule hover:border-rule-strong hover:bg-card transition-all"
                >
                  <span>{tag}</span>
                  <span className="text-[0.65rem] font-mono text-ink-muted">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ===== 底部通栏：分类广告与豆腐块 (Classifieds Grid) ===== */}
      <section className="pt-8 border-t-2 border-rule-strong space-y-4 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase flex items-center gap-2">
            <span className="text-vermilion">◈</span>
            <span>副刊与同业专栏 · CLASSIFIEDS</span>
          </span>
          <span className="text-[0.7rem] font-mono text-ink-muted">
            SECTION B · PAGE 2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 块 1：报友通讯录 */}
          <div className="classified-box p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-rule pb-1 text-xs font-serif font-bold text-ink">
              <span>【同好录 · 友链】</span>
              <Link href="/friends" className="text-[0.68rem] font-mono text-vermilion hover:underline">
                申请入报 &rarr;
              </Link>
            </div>
            {friends.slice(0, 2).map((friend: any) => (
              <div key={friend.name} className="text-xs space-y-0.5">
                <a
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-ink hover:text-vermilion transition-colors inline-block"
                >
                  {friend.name}
                </a>
                <p className="text-ink-secondary text-[0.72rem] line-clamp-1">
                  {friend.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 块 2：出版印行数据 */}
          <div className="classified-box p-4 space-y-2">
            <div className="border-b border-rule pb-1 text-xs font-serif font-bold text-ink">
              <span>【印行总目 · DISPATCH STATS】</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-xs">
              <div className="border border-rule p-1 bg-paper">
                <div className="text-base font-bold text-vermilion">
                  {posts.length}
                </div>
                <div className="text-[0.65rem] text-ink-muted">篇专稿</div>
              </div>
              <div className="border border-rule p-1 bg-paper">
                <div className="text-base font-bold text-ink">
                  {tagsMap.size}
                </div>
                <div className="text-[0.65rem] text-ink-muted">类字盘</div>
              </div>
              <div className="border border-rule p-1 bg-paper">
                <div className="text-base font-bold text-ink">2026</div>
                <div className="text-[0.65rem] text-ink-muted">创刊年</div>
              </div>
            </div>
          </div>

          {/* 块 3：极客箴言 */}
          <div className="classified-box p-4 space-y-2">
            <div className="border-b border-rule pb-1 text-xs font-serif font-bold text-ink">
              <span>【发稿人手札 · AXIOM】</span>
            </div>
            <p className="text-xs font-serif text-ink-secondary italic leading-relaxed pt-1">
              “计算机科学中只有两件难事：缓存失效和命名。愿我们的代码和文字，都能像铅字一样清晰有力。”
            </p>
            <div className="text-right text-[0.68rem] font-mono text-ink-muted">
              —— 计算机系编辑室
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

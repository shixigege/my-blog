import { getPosts } from "@/lib/posts-server";
import { siteConfig } from "@/config/site";

const base = process.env.SITE_URL || "http://localhost:3000";
const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export async function GET() {
  const posts = await getPosts();
  const items = posts.map(p => `<item><title>${esc(p.title)}</title><link>${base}/blog/${p.slug}</link><description>${esc(p.summary||"")}</description><pubDate>${new Date(p.date).toUTCString()}</pubDate><guid>${base}/blog/${p.slug}</guid></item>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(siteConfig.title)}</title><link>${base}</link><description>${esc(siteConfig.description)}</description><language>zh-CN</language>${items}</channel></rss>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

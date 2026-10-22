export interface Post {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  summary?: string;
  cover?: string;
  category?: string;
  hidden?: boolean;
  content?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function getPost(slug: string) {
  const [cfg, md] = await Promise.all([
    fetch(`${BASE}/blogs/${encodeURIComponent(slug)}/config.json`).then((r) =>
      r.ok ? r.json() : {}
    ),
    fetch(`${BASE}/blogs/${encodeURIComponent(slug)}/index.md`).then((r) =>
      r.ok ? r.text() : null
    ),
  ]);
  if (!md) throw new Error("Not found");
  return { ...cfg, slug, content: md };
}

export function readingTime(text: string): number {
  if (!text) return 1;
  const clean = text.replace(/```[\s\S]*?```/g, "").replace(/[#*>\-\[\]!()`~|:;'".,\/\\]/g, " ");
  // 中文字符数
  const chineseChars = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词数
  const englishWords = clean.replace(/[\u4e00-\u9fa5]/g, " ").split(/\s+/).filter(Boolean).length;
  // 中文约 350 字/分钟，英文约 160 词/分钟
  const minutes = chineseChars / 350 + englishWords / 160;
  return Math.max(1, Math.ceil(minutes));
}

export function wordCount(text: string): number {
  if (!text) return 0;
  return text.replace(/```[\s\S]*?```/g, "").replace(/\s/g, "").length;
}

export function getAllTags(posts: Post[]): Map<string, number> {
  const m = new Map<string, number>();
  posts.forEach((p) => p.tags?.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
  return new Map([...m.entries()].sort((a, b) => b[1] - a[1]));
}

export function getArchive(posts: Post[]): Map<string, Post[]> {
  const m = new Map<string, Post[]>();
  posts.forEach((p) => {
    const k = p.date.slice(0, 7);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(p);
  });
  return new Map([...m.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

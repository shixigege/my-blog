export interface Post {
  slug: string; title: string; tags: string[]; date: string;
  summary?: string; cover?: string; category?: string; hidden?: boolean;
  content?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function getPost(slug: string) {
  const [cfg, md] = await Promise.all([
    fetch(`${BASE}/blogs/${encodeURIComponent(slug)}/config.json`).then(r => r.ok ? r.json() : {}),
    fetch(`${BASE}/blogs/${encodeURIComponent(slug)}/index.md`).then(r => r.ok ? r.text() : null),
  ]);
  if (!md) throw new Error("Not found");
  return { ...cfg, slug, content: md };
}

export function readingTime(text: string): number {
  const words = text.replace(/```[\s\S]*?```/g, "").replace(/[#*>\-\[\]!()`~|:;'".,\/\\]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 300));
}

export function wordCount(text: string): number {
  return text.replace(/```[\s\S]*?```/g, "").replace(/\s/g, "").length;
}

export function getAllTags(posts: Post[]): Map<string, number> {
  const m = new Map<string, number>();
  posts.forEach(p => p.tags?.forEach(t => m.set(t, (m.get(t) || 0) + 1)));
  return new Map([...m.entries()].sort((a, b) => b[1] - a[1]));
}

export function getArchive(posts: Post[]): Map<string, Post[]> {
  const m = new Map<string, Post[]>();
  posts.forEach(p => { const k = p.date.slice(0, 7); if (!m.has(k)) m.set(k, []); m.get(k)!.push(p); });
  return new Map([...m.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

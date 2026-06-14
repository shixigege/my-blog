import { promises as fs } from "fs";
import path from "path";
import BlogDetailClient from "./blog-detail-client";

export async function generateStaticParams() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "blogs", "index.json"), "utf-8");
    const posts = JSON.parse(raw);
    return posts.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}

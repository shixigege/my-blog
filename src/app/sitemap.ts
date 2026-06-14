import { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts-server";
import { getAllTags } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const posts = await getPosts();
  const tags = getAllTags(posts);
  return [
    ...[ "/", "/blog", "/about", "/friends", "/archive", "/tags" ].map(p => ({ url: `${base}${p}`, lastModified: new Date() })),
    ...posts.map(p => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date() })),
    ...[...tags.keys()].map(t => ({ url: `${base}/tags/${encodeURIComponent(t)}`, lastModified: new Date() })),
  ] as MetadataRoute.Sitemap;
}

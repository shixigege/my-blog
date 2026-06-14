import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { makeAuthGuard } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const blogDir = path.join(process.cwd(), "public", "blogs");
    const [cfg, md] = await Promise.all([
      fs.readFile(path.join(blogDir, slug, "config.json"), "utf-8").then(JSON.parse).catch(() => ({})),
      fs.readFile(path.join(blogDir, slug, "index.md"), "utf-8").catch(() => null),
    ]);
    if (!md) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ...cfg, slug, content: md });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = makeAuthGuard(req);
  if (guard) return guard;
  try {
    const { slug, title, tags, date, summary, category, cover, content } = await req.json();

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "slug, title and content are required" }, { status: 400 });
    }

    const blogDir = path.join(process.cwd(), "public", "blogs");
    const postDir = path.join(blogDir, slug);

    // Create post directory
    await fs.mkdir(postDir, { recursive: true });

    // Write config.json
    const config = { title, tags: tags || [], date: date || new Date().toISOString().slice(0, 10), summary: summary || "", category: category || "", cover: cover || "", hidden: false };
    await fs.writeFile(path.join(postDir, "config.json"), JSON.stringify(config, null, 2), "utf-8");

    // Write index.md
    await fs.writeFile(path.join(postDir, "index.md"), content, "utf-8");

    // Update index.json
    const indexPath = path.join(blogDir, "index.json");
    let index: any[] = [];
    try {
      const raw = await fs.readFile(indexPath, "utf-8");
      index = JSON.parse(raw);
    } catch {}

    const entry = { slug, title, tags: config.tags, date: config.date, summary: config.summary, category: config.category, cover: config.cover, hidden: false };
    const existing = index.findIndex((p) => p.slug === slug);
    if (existing >= 0) {
      index[existing] = entry;
    } else {
      index.unshift(entry);
    }

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8");

    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

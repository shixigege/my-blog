import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { makeAuthGuard } from "@/lib/auth";

export async function POST(req: Request) {
  const guard = makeAuthGuard(req);
  if (guard) return guard;
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const blogDir = path.join(process.cwd(), "public", "blogs");
    const postDir = path.join(blogDir, slug);

    // Delete post folder
    await fs.rm(postDir, { recursive: true, force: true });

    // Remove from index.json
    const indexPath = path.join(blogDir, "index.json");
    const raw = await fs.readFile(indexPath, "utf-8");
    const index = JSON.parse(raw).filter((p: any) => p.slug !== slug);
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { promises as fs } from "fs";
import path from "path";
import type { Post } from "./posts";

export async function getPosts(): Promise<Post[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "blogs", "index.json"), "utf-8");
    return JSON.parse(raw).filter((p: Post) => !p.hidden);
  } catch { return []; }
}

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { makeAuthGuard } from "@/lib/auth";

const configPath = path.join(process.cwd(), "public", "site-config.json");

export async function GET() {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ avatar: "" });
  }
}

export async function POST(req: Request) {
  const guard = makeAuthGuard(req);
  if (guard) return guard;
  try {
    const body = await req.json();
    const existing = await fs.readFile(configPath, "utf-8").then(JSON.parse).catch(() => ({}));
    const merged = { ...existing, ...body };
    await fs.writeFile(configPath, JSON.stringify(merged, null, 2), "utf-8");
    return NextResponse.json(merged);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

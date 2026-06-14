import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { makeAuthGuard } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const guard = makeAuthGuard(req);
  if (guard) return guard;
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Only jpg/png/webp/gif allowed" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, name), buf);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const guard = makeAuthGuard(req);
  if (guard) return guard;
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

    const filePath = path.join(process.cwd(), "public", "uploads", path.basename(filename));
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const files = await fs.readdir(uploadDir);
    const images = files
      .filter((f) => ALLOWED_EXT.some((ext) => f.toLowerCase().endsWith("." + ext)))
      .sort()
      .reverse()
      .map((f) => ({ name: f, url: `/uploads/${f}`, size: 0 }));
    return NextResponse.json({ images });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

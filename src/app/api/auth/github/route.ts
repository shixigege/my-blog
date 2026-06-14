import { NextResponse } from "next/server";
import { isOwnerConfigured } from "@/lib/auth";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";

export async function GET(request: Request) {
  if (!isOwnerConfigured()) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;
  return NextResponse.redirect(url);
}

import { NextResponse } from "next/server";
import { exchangeGitHubCode, signToken } from "@/lib/auth";

const GITHUB_OWNER = process.env.GITHUB_OWNER || "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/write?auth=error", request.url));
  }

  const user = await exchangeGitHubCode(code);
  if (!user) {
    return NextResponse.redirect(new URL("/write?auth=error", request.url));
  }

  if (user.login !== GITHUB_OWNER) {
    return NextResponse.redirect(new URL("/write?auth=forbidden", request.url));
  }

  const token = signToken({ githubUser: user.login });
  const res = NextResponse.redirect(new URL("/write?auth=success", request.url));
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}

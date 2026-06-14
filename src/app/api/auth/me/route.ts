import { NextResponse } from "next/server";
import { getSessionFromRequest, isOwnerConfigured } from "@/lib/auth";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  return NextResponse.json({
    authed: !!session,
    configured: isOwnerConfigured(),
    user: session?.githubUser || null,
  });
}

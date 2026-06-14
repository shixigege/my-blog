import { KJUR } from "jsrsasign";

const AUTH_SECRET = process.env.AUTH_SECRET || "";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "";

const COOKIE_NAME = "session";
const EXPIRES_IN = 7 * 24 * 60 * 60;

export interface SessionPayload {
  githubUser: string;
}

export function signToken(payload: SessionPayload): string {
  const now = Math.floor(Date.now() / 1000);
  return KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
    JSON.stringify({ ...payload, iat: now, exp: now + EXPIRES_IN }),
    AUTH_SECRET,
  );
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const isValid = KJUR.jws.JWS.verifyJWT(token, AUTH_SECRET, { alg: ["HS256"] });
    if (!isValid) return null;
    const payload = KJUR.jws.JWS.parse(token).payloadObj as any;
    return { githubUser: payload.githubUser };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request): SessionPayload | null {
  const raw = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    raw.split(";").filter(Boolean).map((c) => {
      const eq = c.indexOf("=");
      return eq === -1 ? [c.trim(), ""] : [c.slice(0, eq).trim(), c.slice(eq + 1).trim()];
    }),
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

export function makeAuthGuard(request: Request): Response | null {
  const session = getSessionFromRequest(request);
  if (!session || session.githubUser !== GITHUB_OWNER) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

export async function exchangeGitHubCode(code: string) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return null;

  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();
  return { login: userData.login as string };
}

export function isOwnerConfigured(): boolean {
  return !!(AUTH_SECRET && GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_OWNER);
}

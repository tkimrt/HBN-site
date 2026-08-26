import { NextRequest, NextResponse } from "next/server";

/**
 * Password gate for /admin and /api/admin.
 *
 * The cookie holds a SHA-256 of the password; the middleware recomputes the
 * digest of ADMIN_PASSWORD and compares. No sessions to store, nothing to
 * expire server-side, and changing ADMIN_PASSWORD invalidates every cookie.
 *
 * Local dev and the test harness (NODE_ENV=development / LOCAL_DATA=1) skip
 * the gate — they run against local data. In production a missing
 * ADMIN_PASSWORD fails closed.
 */

const COOKIE = "hbn_admin";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page and its endpoint must stay reachable.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  if (process.env.NODE_ENV === "development" || process.env.LOCAL_DATA === "1") {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD ?? "";
  const isApi = pathname.startsWith("/api/");

  if (!password) {
    return isApi
      ? Response.json({ error: "Admin is locked: ADMIN_PASSWORD is not set on the host." }, { status: 503 })
      : new Response("Admin is locked: ADMIN_PASSWORD is not set on the host.", { status: 503 });
  }

  const expected = await sha256Hex(password);
  const cookie = request.cookies.get(COOKIE)?.value ?? "";
  // Same-length hex comparison; timing differences don't leak digest prefixes
  // usefully, but avoid early-exit anyway.
  let mismatch = cookie.length === expected.length ? 0 : 1;
  for (let i = 0; i < Math.min(cookie.length, expected.length); i++) {
    mismatch |= cookie.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch === 0) return NextResponse.next();

  if (isApi) return Response.json({ error: "Sign in at /admin/login first." }, { status: 401 });
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

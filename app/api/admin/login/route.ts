/** Exchanges the admin password for the gate cookie. See middleware.ts. */

const COOKIE = "hbn_admin";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  let payload: { password?: unknown };
  try {
    payload = (await request.json()) as { password?: unknown };
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) {
    return Response.json({ error: "ADMIN_PASSWORD is not set on the host." }, { status: 503 });
  }
  if (typeof payload.password !== "string" || payload.password !== expected) {
    return Response.json({ error: "That password is not right." }, { status: 401 });
  }

  const value = await sha256Hex(expected);
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${COOKIE}=${value}; Path=/; Max-Age=${THIRTY_DAYS}; HttpOnly; Secure; SameSite=Lax`,
      },
    }
  );
}

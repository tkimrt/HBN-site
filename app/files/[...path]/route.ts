import { getBucket } from "../../../db/storage";

/** Serves PDFs uploaded through /admin. R2 is not publicly addressable. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.map(decodeURIComponent).join("/");

  // Keep reads inside the bucket even if a crafted path gets through the router.
  if (key.includes("..")) return new Response("Not found", { status: 404 });

  let object: R2ObjectBody | null;
  try {
    object = await getBucket().get(key);
  } catch {
    return new Response("File storage is not configured.", { status: 503 });
  }
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Length": String(object.size),
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `inline; filename="${key.split("/").pop()}"`,
    },
  });
}

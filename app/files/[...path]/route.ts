import { readLocalFile } from "../../../db/storage";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Serves files uploaded in local development. Production uploads live on
 *  Vercel Blob and are referenced by absolute URL, bypassing this route. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  const key = parts.map(decodeURIComponent).join("/");
  if (key.includes("..")) return new Response("Not found", { status: 404 });

  const data = await readLocalFile(key);
  if (!data) return new Response("Not found", { status: 404 });

  const dot = key.lastIndexOf(".");
  const type = (dot > -1 && TYPES[key.slice(dot)]) || "application/octet-stream";

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `inline; filename="${key.split("/").pop()}"`,
    },
  });
}

import { getBucket } from "../../../../db/storage";
import { slugify } from "../../../../lib/articles";

// TODO(auth): ungated alongside the rest of /admin. Gate before launch.

const MAX_BYTES = 25 * 1024 * 1024;

/** Extension is what actually decides the folder — the browser's MIME guess is advisory. */
const KINDS = {
  pdf: { folder: "articles", types: ["application/pdf"], ext: [".pdf"] },
  image: {
    folder: "covers",
    types: ["image/jpeg", "image/png", "image/webp"],
    ext: [".jpg", ".jpeg", ".png", ".webp"],
  },
} as const;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Expected a multipart upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file in the request." }, { status: 400 });
  }

  const lower = file.name.toLowerCase();
  const kind = (Object.keys(KINDS) as (keyof typeof KINDS)[]).find((key) => {
    const spec = KINDS[key];
    return (
      spec.ext.some((e) => lower.endsWith(e)) ||
      (spec.types as readonly string[]).includes(file.type)
    );
  });

  if (!kind) {
    return Response.json(
      { error: "Upload a PDF, or a JPG, PNG or WebP image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 25 MB.` },
      { status: 413 }
    );
  }

  const spec = KINDS[kind];
  const dot = lower.lastIndexOf(".");
  const extension = dot > -1 ? lower.slice(dot) : kind === "pdf" ? ".pdf" : ".jpg";
  const base = slugify(file.name.slice(0, dot > -1 ? dot : undefined)) || kind;
  const key = `${spec.folder}/${base}${extension}`;

  try {
    await getBucket().put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }

  return Response.json({ path: `/files/${key}`, name: `${base}${extension}`, kind });
}

#!/usr/bin/env python3
"""Import a PDF article into the compiled archive under content/articles/.

    python3 scripts/import_article.py path/to/Article.pdf \
        --slug the-url-slug \
        --title "The Article Title" \
        --kicker "One sentence standfirst." \
        --category Pricing \
        [--author "Al Trellis"] [--date 2026-07] [--cover /images/art-foo.jpg]

Use this for bulk-importing the back catalogue. One-off pieces are easier to add
through /admin, which stores them in D1 instead of the bundle.

Requires `pdftotext` (poppler). Always read the generated .ts afterwards —
extraction is a first draft, not a finished article.
"""
import argparse
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "articles"
PDF_OUT = ROOT / "public" / "articles"
CONVERTER = pathlib.Path(__file__).resolve().parent / "pdf_to_markdown.py"


def to_ident(slug: str) -> str:
    head, *rest = slug.split("-")
    return head + "".join(part.title() for part in rest)


def convert(pdf: pathlib.Path) -> str:
    if not shutil.which("pdftotext"):
        sys.exit("pdftotext not found. Install poppler (brew install poppler).")
    with tempfile.TemporaryDirectory() as tmp:
        txt = pathlib.Path(tmp) / "out.txt"
        subprocess.run(["pdftotext", "-layout", str(pdf), str(txt)], check=True)
        result = subprocess.run(
            [sys.executable, str(CONVERTER), str(txt)], check=True, capture_output=True, text=True
        )
    return result.stdout.strip()


def rewrite_index() -> None:
    slugs = sorted(p.stem for p in CONTENT.glob("*.ts") if p.stem not in {"index", "types"})
    existing = (CONTENT / "index.ts").read_text() if (CONTENT / "index.ts").exists() else ""
    # Preserve the curated running order; append anything new to the end.
    ordered = [s for s in re.findall(r'from "\./([^"]+)"', existing) if s in slugs]
    ordered += [s for s in slugs if s not in ordered]

    imports = "\n".join(f'import {to_ident(s)} from "./{s}";' for s in ordered)
    listing = "\n".join(f"  {to_ident(s)}," for s in ordered)
    (CONTENT / "index.ts").write_text(
        'import type { Article } from "./types";\n'
        f"{imports}\n\n"
        "// Ordered newest-first for the index page.\n"
        f"export const staticArticles: Article[] = [\n{listing}\n];\n\n"
        "export const staticArticleBySlug = new Map(staticArticles.map((a) => [a.slug, a]));\n"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=pathlib.Path)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--kicker", default="")
    parser.add_argument("--category", default="Strategy")
    parser.add_argument("--author", default="Al Trellis")
    parser.add_argument("--date", default="", help="YYYY-MM or YYYY-MM-DD; leave blank if undated")
    parser.add_argument("--cover", default="")
    args = parser.parse_args()

    if not args.pdf.exists():
        sys.exit(f"No such file: {args.pdf}")

    body = convert(args.pdf)
    # The converter emits the cover title as a figure comment; drop it.
    body = re.sub(r"^<!-- FIGURE: [^>]*-->\n+", "", body)
    body = re.sub(r"^## " + re.escape(args.title) + r"\n+", "", body)
    body = re.sub(r"<!-- FIGURE: (.+?) -->", r"> \1", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    PDF_OUT.mkdir(parents=True, exist_ok=True)
    (PDF_OUT / f"{args.slug}.pdf").write_bytes(args.pdf.read_bytes())

    words = len(re.sub(r"[#>\-*!\[\]()]", " ", body).split())
    meta = {
        "slug": args.slug,
        "title": args.title,
        "kicker": args.kicker,
        "category": args.category,
        "author": args.author,
        "date": args.date,
        "cover": args.cover,
        "pdf": f"/articles/{args.slug}.pdf",
        "minutes": max(2, round(words / 220)),
    }
    fields = "\n".join(f"  {k}: {v!r}," for k, v in meta.items()).replace("'", '"')
    escaped = body.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    (CONTENT / f"{args.slug}.ts").write_text(
        'import type { Article } from "./types";\n\n'
        f"const article: Article = {{\n{fields}\n  body: `{escaped}`,\n}};\n\n"
        "export default article;\n"
    )
    rewrite_index()
    print(f"wrote content/articles/{args.slug}.ts  ({words} words, ~{meta['minutes']} min)")
    print("Review the body before committing — extraction is a first draft.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate a site image via the OpenAI Responses API image_generation tool.

    python3 scripts/generate_image.py <slug> "<prompt>" [--portrait|--square]

Writes public/images/<slug>.jpg. Reads OPENAI_API_KEY from ./.env.
Every prompt gets STYLE appended so the whole site reads as one art direction.
"""
import base64
import io
import json
import os
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "images"
MODEL = os.environ.get("HBN_IMAGE_MODEL", "gpt-5.6")

STYLE = (
    " Style: restrained editorial architectural photography, natural daylight, muted "
    "desaturated palette of deep forest green, warm cream, stone grey and a single "
    "restrained terracotta accent. Calm, confident, expensive-looking. Shallow depth "
    "where appropriate, generous negative space, nothing busy. "
    "No text, no lettering, no signage, no logos, no watermarks, no house numbers, "
    "no for-sale signs. No faces or recognizable people in the foreground."
)

SIZES = {"landscape": "1536x1024", "portrait": "1024x1536", "square": "1024x1024"}


def generate(slug: str, prompt: str, shape: str = "landscape", quality: int = 82) -> pathlib.Path:
    key = os.environ.get("OPENAI_API_KEY") or read_env_key()
    body = {
        "model": MODEL,
        "input": prompt + STYLE,
        "tools": [
            {
                "type": "image_generation",
                "size": SIZES[shape],
                "quality": "high",
                "output_format": "jpeg",
            }
        ],
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        payload = json.load(resp)

    for item in payload.get("output", []):
        if item.get("type") == "image_generation_call" and item.get("result"):
            OUT_DIR.mkdir(parents=True, exist_ok=True)
            path = OUT_DIR / f"{slug}.jpg"
            raw = base64.b64decode(item["result"])
            path.write_bytes(raw)
            shrink(path, quality=quality)
            return path

    raise SystemExit(f"no image in response: {json.dumps(payload)[:800]}")


def shrink(path: pathlib.Path, max_w: int = 2000, quality: int = 82) -> None:
    """Keep page weight sane — the raw API JPEGs are far larger than the site needs."""
    try:
        from PIL import Image
    except ImportError:
        return
    im = Image.open(path).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    path.write_bytes(buf.getvalue())


def read_env_key() -> str:
    # scripts/.env is preferred: vinext loads the project-root .env as Worker
    # secrets, and the running site has no business holding an image-gen key.
    for env_file in (ROOT / "scripts" / ".env", ROOT / ".env"):
        if not env_file.exists():
            continue
        for line in env_file.read_text().splitlines():
            if line.startswith("OPENAI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("OPENAI_API_KEY not found in scripts/.env or .env")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = {a.lstrip("-") for a in sys.argv[1:] if a.startswith("--")}
    if len(args) < 2:
        raise SystemExit(__doc__)
    shape = "portrait" if "portrait" in flags else "square" if "square" in flags else "landscape"
    print(generate(args[0], args[1], shape))

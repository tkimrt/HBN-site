#!/usr/bin/env python3
"""Build the favicon and Open Graph card from the HBN logo.

    python3 scripts/make_brand_assets.py

Reads public/brand/hbn-logo*.png (produced from the client's original logo) and
writes public/brand/favicon.png and public/og.png.
"""
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "brand"
CREAM = (243, 238, 228, 255)
FOREST = (14, 45, 38, 255)


def trim_left_shadow(logo: Image.Image) -> Image.Image:
    """Drop the cast shadow that trails to the left of the "H".

    It is the widest thing in the logo and carries no meaning, so removing it
    lets the actual mark scale up — the artwork goes from 236px wide to 197px,
    which at favicon size is about 20% more height for the same tile.

    Only the lower half is touched: the wordmark sits in the upper half and its
    first glyph starts to the right of where the shadow begins.
    """
    logo = logo.convert("RGBA")
    px = logo.load()
    w, h = logo.size
    lower = int(h * 0.45)

    def is_green(pixel: tuple[int, int, int, int]) -> bool:
        r, g, b, a = pixel
        return a >= 60 and g > r and g > b and (max(r, g, b) - min(r, g, b)) > 25

    letters_start = next(
        (x for x in range(w) if any(is_green(px[x, y]) for y in range(lower, h))), 0
    )
    for x in range(letters_start):
        for y in range(lower, h):
            px[x, y] = (0, 0, 0, 0)

    return logo.crop(logo.getbbox())


def favicon(size: int = 512) -> None:
    """The full logo, scaled to fill the tile.

    Padding is deliberately minimal — a favicon renders at 16–32px, so every
    pixel of margin is one the mark does not get.
    """
    mark = trim_left_shadow(Image.open(BRAND / "hbn-logo.png"))

    canvas = Image.new("RGBA", (size, size), CREAM)
    pad = round(size * 0.03)
    box = size - pad * 2
    scale = min(box / mark.width, box / mark.height)
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))

    canvas.save(BRAND / "favicon.png")
    print("public/brand/favicon.png", canvas.size, f"mark {mark.size}")


def og_card(width: int = 1200, height: int = 630) -> None:
    photo = Image.open(ROOT / "public" / "images" / "hero-community.jpg").convert("RGBA")

    # Cover-crop the hero to the card ratio.
    scale = max(width / photo.width, height / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = (photo.width - width) // 2
    top = (photo.height - height) // 3  # bias upward; the interest is above centre
    card = photo.crop((left, top, left + width, top + height))

    # Forest scrim so the knockout logo reads at any thumbnail size.
    card = Image.alpha_composite(card, Image.new("RGBA", card.size, FOREST[:3] + (216,)))

    logo = Image.open(BRAND / "hbn-logo-light.png").convert("RGBA")
    scale = (width * 0.46) / logo.width
    logo = logo.resize((round(logo.width * scale), round(logo.height * scale)), Image.LANCZOS)
    card.alpha_composite(logo, ((width - logo.width) // 2, (height - logo.height) // 2))

    card.convert("RGB").save(ROOT / "public" / "og.png", optimize=True)
    print("public/og.png", card.size)


if __name__ == "__main__":
    favicon()
    og_card()

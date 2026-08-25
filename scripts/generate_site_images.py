#!/usr/bin/env python3
"""Generate the whole HBN image set. Skips any slug already on disk.

    python3 scripts/generate_site_images.py            # everything missing
    python3 scripts/generate_site_images.py hero plans  # only these slugs

Article covers stay deliberately abstract-architectural. Nothing here depicts a
real HBN project, a real community, or a real person.
"""
import concurrent.futures
import pathlib
import sys

from generate_image import OUT_DIR, generate

PHOTOS = {
    "hero-community": (
        "A quiet, well-planned new residential street receding into the distance at "
        "early evening, seen from the sidewalk: mature trees arching overhead, stone "
        "garden walls, clipped hedging, one home softly lit from within. Wide "
        "horizontal composition with depth down the street.",
        "landscape",
    ),
    "land-planning": (
        "A wide elevated view over a partially built residential community: finished "
        "streets curving through graded lots, preserved tree stands, an open green "
        "commons, and the clear geometry of a thoughtful land plan reading from above. "
        "Late afternoon, long soft shadows.",
        "landscape",
    ),
    "consulting": (
        "An architect's working table photographed from directly above: large-format "
        "site drawings and elevation sheets fanned out, a scale ruler, a pencil, a "
        "cup of coffee, one hand at the very edge of frame. Nothing branded, no "
        "readable drawing titles.",
        "landscape",
    ),
    "plans": (
        "A single new home exterior at dusk, three-quarter view from the curb: clean "
        "gabled massing, stone base, warm timber entry, deep porch, restrained "
        "landscaping. Windows glowing. The architecture is the subject.",
        "landscape",
    ),
    "speaking": (
        "A conference ballroom photographed from the rear of the room over the backs of "
        "a seated audience toward a brightly lit stage with a large blank presentation "
        "screen. Faces not visible. Warm stage light against a dim room.",
        "landscape",
    ),
    "design-services": (
        "A designer's desk in raking morning light: a stack of hand-drawn floor plan "
        "sketches on trace paper, a soft pencil, an architect's scale, and a partially "
        "unrolled elevation drawing. Warm cream paper, deep shadow, calm and precise.",
        "landscape",
    ),
    "renderings": (
        "A large-format watercolor architectural elevation rendering of a craftsman "
        "style home pinned flat to a studio wall, edges of the paper visible, soft "
        "washes of green and warm grey, loose confident brushwork, generous white space "
        "around the drawing.",
        "landscape",
    ),
    "insights": (
        "A stack of printed reports and bound papers on a dark wood table beside a "
        "reading lamp, one open to a page of charts, photographed at a low angle in warm "
        "evening light. Text on the pages is illegible and abstract.",
        "landscape",
    ),
}

COVERS = {
    "art-leadership": "A single empty chair at the head of a long dark table in an "
    "otherwise empty boardroom, one shaft of window light across it.",
    "art-lot-premiums": "An abstract overhead study of subdivided residential lots as "
    "clean geometric parcels of grass, gravel and paving, a few plots noticeably larger.",
    "art-expected-value": "An abstract still life: three identical stone blocks of "
    "different heights on a cream surface, hard directional light, long shadows.",
    "art-conceding": "An abstract still life of four small wrapped parcels of "
    "descending size arranged in a row on a warm neutral surface, raking light.",
    "art-pricing-psychology": "An abstract still life: two visually identical stone "
    "objects on separate pedestals of very different height, museum lighting.",
    "art-five-thinkers": "A wall of old cloth-bound books shot straight on in low warm "
    "light, spines blank and unreadable, deep shadow at the edges.",
    "art-attitude": "An abstract overhead arrangement of five unequal wedge-shaped "
    "stone and clay tiles forming a circle on a cream plaster surface.",
    "art-warfare": "An abstract overhead view of a weathered topographic terrain model "
    "in plaster and stone, ridgelines and a river valley, single hard light source.",
    "art-selling-value": "Two identical plain ceramic vessels on a cream surface, one "
    "lit warmly and set on a stone plinth, the other flat and unlit beside it.",
    "art-scale": "An abstract overhead study of the same house form repeated across a "
    "grid, tiny at one corner and growing steadily larger toward the other, in cream "
    "plaster and deep green.",
    "art-evolve": "An abstract still life of three stone forms on cream plaster, the "
    "left one weathered and cracked, the right one crisp and newly cut, hard light.",
    "art-truisms": "Two identical stone wedges on a cream surface pushed together until "
    "they meet edge to edge, a single hard shadow between them.",
    "art-binary": "An abstract composition of a cream plaster wall broken by one clean "
    "full-height vertical slot of deep shadow — either side, nothing between.",
    "art-whiners": "An abstract still life: a single small pebble sitting in the centre "
    "of a wide empty cream plaster field, one long raking shadow.",
}


def main() -> None:
    wanted = sys.argv[1:]
    jobs = []
    for slug, (prompt, shape) in PHOTOS.items():
        # The hero is the largest image on the site; encode it less aggressively.
        jobs.append((slug, prompt, shape, 90 if slug == 'hero-community' else 82))
    for slug, prompt in COVERS.items():
        jobs.append((slug, prompt, "square", 82))

    if wanted:
        jobs = [j for j in jobs if j[0] in wanted]
    jobs = [j for j in jobs if not (OUT_DIR / f"{j[0]}.jpg").exists()]

    if not jobs:
        print("nothing to do — all images present")
        return
    print(f"generating {len(jobs)}: {', '.join(j[0] for j in jobs)}", flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = {pool.submit(generate, *j): j[0] for j in jobs}
        for fut in concurrent.futures.as_completed(futures):
            slug = futures[fut]
            try:
                path = fut.result()
                kb = pathlib.Path(path).stat().st_size // 1024
                print(f"  ok   {slug}  ({kb} KB)", flush=True)
            except Exception as exc:  # keep the batch going
                print(f"  FAIL {slug}: {exc}", flush=True)


if __name__ == "__main__":
    main()

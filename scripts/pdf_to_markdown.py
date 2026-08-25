#!/usr/bin/env python3
"""pdftotext -layout output -> clean markdown.

Several of these PDFs set paragraphs with no blank line between them, so blank
lines alone can't find the breaks. Instead we measure the text column: a wrapped
line runs to (nearly) the full column width, so any line that falls well short of
it is the last line of something.
"""
import pathlib
import re
import sys

SRC = pathlib.Path(sys.argv[1])
raw = SRC.read_text()

DROP = re.compile(
    r"^(by\s+al\s+trellis.*|al\s+trellis.*|home\s+builders\s+network|www\.hbnnet\.com|"
    r"mail@hbnnet\.com.*|page\s*\d+|\d{1,3})$",
    re.I,
)
ADDRESS = re.compile(r"georgetown blvd|eldersburg|301\.829|mail@hbnnet", re.I)
BULLET = re.compile(r"^[•●·]\s*|^[*\-–]\s+")
NUMBERED = re.compile(r"^(\d{1,2})[.)]\s+")
TERMINAL = ('.', '!', '?', '"', '”', ')', ':', '.”', '."')

lines = [ln.rstrip() for ln in raw.replace("\f", "\n").splitlines()]
lines = [ln for ln in lines if not DROP.match(ln.strip()) and not ADDRESS.search(ln)]

body = [ln for ln in lines if ln.strip()]
if not body:
    sys.exit(0)
# Column width from the bulk of the text, ignoring stray long table rows.
widths = sorted(len(ln.rstrip()) for ln in body)
column = widths[int(len(widths) * 0.9)]

# --- split into logical units ------------------------------------------------
units: list[dict] = []
buf: list[str] = []
buf_indent: list[int] = []


def flush(kind: str = "p") -> None:
    global buf, buf_indent
    if not buf:
        return
    units.append({"kind": kind, "lines": buf, "indent": min(buf_indent)})
    buf, buf_indent = [], []


for ln in lines:
    s = ln.strip()
    if not s:
        flush()
        continue

    marker = BULLET.match(s) or NUMBERED.match(s)
    if marker:
        flush()
        buf.append(s)
        buf_indent.append(len(ln) - len(s))
        continue

    buf.append(s)
    buf_indent.append(len(ln) - len(s))

    if len(s) < column * 0.90 and s.endswith(TERMINAL):
        flush()
    elif (
        len(buf) == 1
        and len(s) < min(column * 0.72, 82)
        and not s.endswith(TERMINAL + (",", ";", "-"))
        and s[0].isupper()
    ):
        # A standalone short line with no terminal punctuation is a section head.
        flush()

flush()

# Page breaks split sentences; stitch those halves back together.
merged: list[dict] = []
for unit in units:
    prev = merged[-1] if merged else None
    if (
        prev
        and prev["kind"] == unit["kind"] == "p"
        and not BULLET.match(unit["lines"][0])
        and not NUMBERED.match(unit["lines"][0])
        and not prev["lines"][-1].rstrip().endswith(TERMINAL)
        and unit["lines"][0][0].islower()
    ):
        prev["lines"].extend(unit["lines"])
        continue
    merged.append(unit)
units = merged

# --- classify + emit ---------------------------------------------------------
out: list[str] = []
for i, unit in enumerate(units):
    raw_lines = unit["lines"]
    joined = raw_lines[0]
    for nxt in raw_lines[1:]:
        joined = joined[:-1] + nxt if joined.endswith("-") and not joined.endswith(" -") else f"{joined} {nxt}"
    text = re.sub(r"\s{2,}", " ", joined).strip()
    if not text:
        continue

    if BULLET.match(text):
        out.append(f"- {BULLET.sub('', text)}")
        continue
    if NUMBERED.match(text):
        out.append(f"{NUMBERED.match(text).group(1)}. {NUMBERED.sub('', text)}")
        out.append("")
        continue

    # Centred, deeply indented one-liners in the Atlas briefs are figure captions.
    if unit["indent"] >= 8 and len(text) < 210 and len(raw_lines) <= 2:
        out.append(f"<!-- FIGURE: {text} -->")
        out.append("")
        continue

    is_heading = (
        len(text) < 88
        and not text.endswith((".", ",", ";", "-", "!", "?"))
        and text[0].isupper()
        and len(raw_lines) <= 2
    )
    out.append(f"## {text}" if is_heading else text)
    out.append("")

md = "\n".join(out)
md = re.sub(r"\n{3,}", "\n\n", md)
print(md.strip())

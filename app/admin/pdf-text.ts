import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// Served from public/ — copied from node_modules/pdfjs-dist/build/ (the Vite
// `?url` import vinext supported doesn't exist in Next). Re-copy on upgrade.
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Line = { y: number; x: number; width: number; text: string };

/**
 * Pull a first-draft markdown body out of a dropped PDF.
 *
 * The output is a starting point, not a finished article — the editor exists so
 * an author can fix what the extraction gets wrong. Paragraph breaks are found
 * by measuring the text column: wrapped lines run to nearly the full width, so a
 * line that falls well short of it ends something.
 */
export async function extractPdfText(file: File): Promise<string> {
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
  const lines: Line[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const byRow = new Map<number, Line>();

    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue;
      const x = item.transform[4] as number;
      const y = Math.round((item.transform[5] as number) / 3) * 3; // tolerate baseline jitter
      const existing = byRow.get(y);
      if (existing) {
        existing.text += (needsSpace(existing.text, item.str) ? " " : "") + item.str;
        existing.width = Math.max(existing.width, x + item.width - existing.x);
      } else {
        byRow.set(y, { y, x, width: item.width, text: item.str });
      }
    }

    lines.push(
      ...[...byRow.values()]
        .sort((a, b) => b.y - a.y)
        .map((line) => ({ ...line, text: line.text.replace(/\s+/g, " ").trim() }))
        .filter((line) => line.text)
    );
  }
  await pdf.destroy();

  return toMarkdown(lines);
}

function needsSpace(before: string, after: string): boolean {
  return !before.endsWith(" ") && !after.startsWith(" ");
}

const NOISE = /^(www\.hbnnet\.com|home builders network|mail@hbnnet\.com.*|page \d+|\d{1,3})$/i;

function toMarkdown(lines: Line[]): string {
  const kept = lines.filter((line) => !NOISE.test(line.text));
  if (!kept.length) return "";

  const widths = [...kept].map((l) => l.text.length).sort((a, b) => a - b);
  const column = widths[Math.floor(widths.length * 0.9)] || 80;

  const blocks: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (!buffer.length) return;
    blocks.push(buffer.join(" ").replace(/(\w)-\s(\w)/g, "$1$2"));
    buffer = [];
  };

  for (const line of kept) {
    const text = line.text;
    const listMatch = /^([•●·]|\d{1,2}[.)])\s+/.exec(text);
    if (listMatch) {
      flush();
      const marker = /^\d/.test(listMatch[1]) ? listMatch[1].replace(/[)]/, ".") : "-";
      blocks.push(`${marker} ${text.slice(listMatch[0].length)}`);
      continue;
    }

    buffer.push(text);
    const short = text.length < column * 0.9;
    if (short && /[.!?"”)]$/.test(text)) {
      flush();
    } else if (buffer.length === 1 && text.length < Math.min(column * 0.72, 82) && !/[.,;:!?-]$/.test(text)) {
      blocks.push(`## ${buffer.pop()!}`); // standalone short line with no terminal punctuation
    }
  }
  flush();

  return blocks.join("\n\n");
}

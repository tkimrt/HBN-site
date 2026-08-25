import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A deliberately small markdown subset, rendered straight to React nodes so no
 * article body — including anything pasted into the admin editor — is ever
 * injected as HTML.
 *
 * Block:  ## h2 · ### h3 · > quote · - bullets · 1. numbers · ![alt](src) · ---
 * Inline: **strong** · *em* · [text](href)
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={key} href={href}>{label}</Link>
      ) : (
        <a key={key} href={href} target="_blank" rel="noreferrer noopener">{label}</a>
      );
    }
    return <span key={key}>{token}</span>;
  });
}

const IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const BULLET = /^[-*]\s+/;
const NUMBERED = /^\d{1,2}[.)]\s+/;

export function Markdown({ body }: { body: string }) {
  return <div className="prose">{parseBlocks(body)}</div>;
}

function parseBlocks(body: string): ReactNode[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;

  const collectList = (match: RegExp) => {
    const items: string[] = [];
    while (i < lines.length) {
      const line = lines[i].trim();
      if (match.test(line)) {
        items.push(line.replace(match, ""));
        i += 1;
      } else if (line === "" && match.test((lines[i + 1] ?? "").trim())) {
        i += 1; // blank line between items of the same list
      } else {
        break;
      }
    }
    return items;
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }
    if (line === "---") {
      nodes.push(<hr key={i} />);
      i += 1;
      continue;
    }

    const image = IMAGE.exec(line);
    if (image) {
      const [, alt, src] = image;
      nodes.push(
        <figure className="prose-figure" key={i}>
          <img src={src} alt={alt} />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      nodes.push(<h3 key={i}>{inline(line.slice(4), `h3-${i}`)}</h3>);
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(<h2 key={i}>{inline(line.slice(3), `h2-${i}`)}</h2>);
      i += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quote.push(lines[i].trim().slice(2));
        i += 1;
      }
      nodes.push(
        <blockquote className="prose-quote" key={`q-${i}`}>
          {inline(quote.join(" "), `q-${i}`)}
        </blockquote>
      );
      continue;
    }

    if (BULLET.test(line)) {
      const start = i;
      const items = collectList(BULLET);
      nodes.push(
        <ul key={`ul-${start}`}>
          {items.map((item, n) => <li key={n}>{inline(item, `ul-${start}-${n}`)}</li>)}
        </ul>
      );
      continue;
    }
    if (NUMBERED.test(line)) {
      const start = i;
      const items = collectList(NUMBERED);
      nodes.push(
        <ol key={`ol-${start}`}>
          {items.map((item, n) => <li key={n}>{inline(item, `ol-${start}-${n}`)}</li>)}
        </ol>
      );
      continue;
    }

    // Paragraph: soft-wrapped lines run until a blank line or the next block.
    const paragraph: string[] = [];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next.startsWith("#") ||
        next.startsWith("> ") ||
        next === "---" ||
        BULLET.test(next) ||
        NUMBERED.test(next) ||
        IMAGE.test(next)
      ) {
        break;
      }
      paragraph.push(next);
      i += 1;
    }
    nodes.push(<p key={`p-${i}`}>{inline(paragraph.join(" "), `p-${i}`)}</p>);
  }

  return nodes;
}

/** First paragraph of a body, for cards and meta descriptions. */
export function excerpt(body: string, max = 190): string {
  const first = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith(">") && !IMAGE.test(l) && !BULLET.test(l));
  if (!first) return "";
  const plain = first.replace(/\*\*|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

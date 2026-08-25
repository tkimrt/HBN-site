# Home Builders Network

Marketing site and article library for [hbnnet.com](http://www.hbnnet.com), built
on [vinext](https://github.com/cloudflare/vinext) (Next.js App Router on
Cloudflare Workers) with D1 and R2.

## Prerequisites

- Node.js `>=22.13.0` — on Node 20 the build dies with `node:fs/promises` has no
  export named `glob`
- `poppler` (`brew install poppler`) and Python 3 — only for the article import
  and image scripts, not for running the site

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm test
```

## Pages

| Route | Notes |
| --- | --- |
| `/` | Home |
| `/consulting` · `/land-planning` · `/design` · `/renderings` · `/plans` · `/speaking` | Services, mirroring the sections on the old hbnnet.com |
| `/resources` | The six free builder-tool handouts plus the TINS brochure |
| `/articles` | Article index, filterable by category via `?category=` |
| `/articles/[slug]` | Long-form web view |
| `/articles/[slug]/original` | The source PDF, embedded, with a download button |
| `/about` · `/contact` | |
| `/admin` | Article admin — **currently unauthenticated, see below** |
| `/admin/events` | Speaking event admin |
| `/admin/enquiries` | Contact form inbox |

## Articles

Articles come from two places and are merged by `lib/articles.ts`:

1. **The migrated archive** — 14 pieces under `content/articles/*.ts`, compiled
   into the bundle. These always render, even with no database bound.
2. **Anything written in `/admin`** — stored in D1.

Both are markdown, rendered by `app/markdown.tsx`. That renderer supports a
deliberately small subset (`##`/`###`, paragraphs, `-`/`1.` lists, `>` quotes,
`---`, `![alt](src)`, `**bold**`, `*italic*`, `[link](url)`) and emits React nodes
directly — no `dangerouslySetInnerHTML`, so pasted content cannot inject markup.

Dates appear only where the source document states one. Nothing was invented; the
rest show category and reading time only.

### Adding one article

Use `/admin`. Write it in the editor, or drop in a `.md`, `.txt` or `.pdf`.
Dropping a PDF extracts its text into the body (client-side, via `pdfjs-dist`)
and uploads the file to R2 so it stays downloadable. **Read the extracted body
before publishing** — extraction is a first draft, not a finished article.

Cover images: drop or browse to upload (stored in R2 under `covers/`), or paste
the path of an image that already ships with the site.

### Bulk-importing the back catalogue

There are 200+ articles in the archive; 14 are in so far. For the rest:

```bash
python3 scripts/import_article.py ~/Downloads/Some\ Article.pdf \
  --slug some-article --title "Some Article" --category Pricing \
  --kicker "One sentence standfirst."
```

That writes `content/articles/<slug>.ts`, copies the PDF to `public/articles/`,
and rewrites the index. Review the generated body — the converter finds paragraph
breaks by measuring the text column, and it is not always right.

## Speaking events

Managed at `/admin/events` and rendered on `/speaking` and in the home page band.
The next event by date is the one featured; anything in the past drops to a
"Past" list in the admin and off the public page.

The currently announced session is seeded in `content/events.ts` so both surfaces
render before D1 exists. Seeded and database events show side by side — a stored
row with the same name and date supersedes its seed, which is what the admin's
**Import** action produces. Nothing disappears when you add your first event.

## Contact form

`/contact` POSTs to `app/api/contact/route.ts`. Every submission is written to
D1 **first** and emailed **second**, so a mail outage or a missing key can never
lose an enquiry — `/admin/enquiries` reads straight from the table and shows the
delivery status of each one.

Email goes out through [Resend](https://resend.com). Set these as Worker secrets
(a project-root `.env` in local dev):

```bash
RESEND_API_KEY=re_...                                  # required to actually send
CONTACT_TO=admin@hbnnet.com                            # optional, this is the default
CONTACT_FROM="Home Builders Network <website@hbnnet.com>"   # domain must be verified
```

Without `RESEND_API_KEY` the form still works and still captures everything; the
status is recorded as `skipped`. The form carries a honeypot field — submissions
that fill it are accepted and discarded.

## Images

Site photography and article covers are generated through the OpenAI Responses
API. **These are illustrations, not documentation** — they do not depict real HBN
projects, communities or people, and should not be paired with copy implying they
do.

```bash
# key goes in scripts/.env, NOT the project-root .env — vinext loads the root
# .env as Worker secrets, and the running site has no use for this key
echo 'OPENAI_API_KEY=sk-...' > scripts/.env

python3 scripts/generate_site_images.py            # everything missing
python3 scripts/generate_site_images.py art-scale  # one slug
python3 scripts/generate_image.py my-slug "a prompt" [--portrait|--square]
```

`generate_image.py` appends a shared `STYLE` suffix to every prompt — that is what
keeps the set coherent, and it carries the negatives (no text, no logos, no faces
in the foreground). Edit it there rather than per-prompt.

Brand assets derive from the client's logo:

```bash
python3 scripts/make_brand_assets.py   # public/brand/favicon.png, public/og.png
```

## Database

`.openai/hosting.json` declares the `DB` (D1) and `BUCKET` (R2) bindings; the Vite
config simulates both locally.

```bash
npm run db:generate                        # after editing db/schema.ts
node scripts/apply-local-migrations.mjs    # apply to the local Miniflare D1
```

On the hosting platform the control plane applies whatever is in `drizzle/`. Every
read path degrades gracefully — with no bindings the site still serves the full
compiled archive, which is what `npm test` exercises.

## Hosting

The app is a standard Next.js 16 project. It runs on Vercel; the client's DNS
stays at Network Solutions.

- **Database** — libSQL via Drizzle. Local dev uses `file:.data/local.db`
  (created by `npm run db:migrate`). Production uses Turso: set `DATABASE_URL`
  (libsql://…) and `DATABASE_AUTH_TOKEN`.
- **Uploads** — Vercel Blob in production (`BLOB_READ_WRITE_TOKEN`, added by
  attaching a Blob store to the project). Local dev writes to `.data/uploads/`.
- **Email** — Resend, unchanged: `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`.

### Deploying

1. `npx vercel` from the project root (first run links the project; needs the
   Pro plan — agency work counts as commercial use).
2. Create a Turso database, run
   `DATABASE_URL=libsql://… DATABASE_AUTH_TOKEN=… npm run db:migrate`,
   then `node scripts/import-data.mjs` with the same env to copy events and
   enquiries across from the old Cloudflare D1 database.
3. Add the env vars above in the Vercel project settings, plus a Blob store.
4. `npx vercel --prod`.

### Pointing hbnnet.com at it (records at Network Solutions)

    A      @     76.76.21.21
    CNAME  www   cname.vercel-dns.com

Nameservers do not move. Add both hostnames to the Vercel project first so it
can issue certificates. Mail records (MX/SPF/DKIM) are untouched.

### Legacy Cloudflare deployment

The previous Workers deployment (hbn-website.realtorch.workers.dev) still runs
the pre-migration build and keeps working until the Vercel cutover. Do **not**
run `npm run deploy:cloudflare` from this tree — the db and storage layers no
longer target D1/R2. The wrangler config and worker/ entry are kept only until
the cutover is confirmed, then can be deleted.


## Before launch

- **`/admin` and `/api/admin/*` are unauthenticated.** Anyone who reaches them can
  publish to the public article library. Gate them — `app/chatgpt-auth.ts` has
  ready-made Sign-in-with-ChatGPT helpers if this stays on OpenAI Sites, or add a
  shared-secret check. The `TODO(auth)` comments mark every spot.
- **Contact email is not sending yet.** The form captures everything to D1 and
  `/admin/enquiries` shows it, but nothing reaches an inbox until `RESEND_API_KEY`
  is set and the sending domain is verified. Until then someone has to check the
  admin inbox.
- No rate limiting on `/api/contact`. Add a KV or Turnstile check if it attracts
  spam beyond what the honeypot catches.
- Most article dates are blank; fill them in through `/admin` where the originals
  are known.

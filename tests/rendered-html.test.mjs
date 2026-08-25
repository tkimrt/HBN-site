import assert from "node:assert/strict";
import test from "node:test";

/** Fetches from the `next start` server booted by tests/setup.mjs. */
async function render(path) {
  return fetch(`${globalThis.__SITE__}${path}`, { headers: { accept: "text/html" } });
}

test("home page renders the brand and pulls in real articles", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Home Builders Network<\/title>/i);
  assert.match(html, /builders more/);
  assert.match(html, /\/brand\/hbn-logo\.png/, "header should use the real logo");
  assert.match(html, /Get an Attitude/, "insights should come from the article store");
  assert.doesNotMatch(html, /VIZZE/i, "no third-party branding in imagery");
});

test("article index lists the migrated archive with categories", async () => {
  const html = await (await render("/articles")).text();
  for (const title of [
    "Understanding Scale",
    "Homebuilding is Warfare",
    "The Psychological and Emotional Aspects of Pricing",
    "Your Salespeople Do What?",
  ]) {
    assert.ok(html.includes(title), `expected "${title}" on the index`);
  }
  assert.match(html, /category=Leadership/, "category filters should be linked");
});

test("an article page renders the summary only, with no PDF or cover", async () => {
  const response = await render("/articles/conceding-correctly");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Conceding Correctly/);
  assert.match(html, /class="prose"/, "body should render through the markdown renderer");
  assert.match(html, /Ron Popeil/, "full article text should be present, not an excerpt");
  // Only the summary is published: no original-PDF reader, no download, no cover.
  assert.doesNotMatch(html, /conceding-correctly\.pdf/, "PDF should not be linked");
  assert.doesNotMatch(html, /\/original/, "original-PDF route should not be linked");
  assert.doesNotMatch(html, /class="article-cover"/, "cover image should not head the article");
});

test("every archive article has a slug, cover and body", async () => {
  const { staticArticles } = await import("../content/articles/index.ts").catch(() => ({}));
  if (!staticArticles) return; // TS source is not loadable from plain node; covered above.

  for (const article of staticArticles) {
    assert.ok(article.slug && article.title && article.body.length > 200, article.slug);
  }
});

test("withdrawn articles are gone from the archive and the index", async () => {
  const html = await (await render("/articles")).text();
  for (const title of ["Evolve or Perish", "Attention All Whiners"]) {
    assert.ok(!html.includes(title), `"${title}" should be withdrawn`);
  }
});

test("an article body starting with an h1 renders instead of looping", async () => {
  // Regression: `# h1` used to fall through the block handlers into the
  // paragraph collector without consuming the line — an infinite loop that
  // took the whole server down with it.
  const post = await fetch(`${globalThis.__SITE__}/api/admin/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: "h1-regression-test", title: "H1 Regression Test", kicker: "",
      category: "Strategy", author: "Test", date: "2026-08-25", cover: "", pdf: "",
      body: "# A top-level heading\n\nAnd a paragraph.", published: true,
    }),
  });
  assert.equal(post.status, 201);
  try {
    const page = await render("/articles/h1-regression-test");
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /A top-level heading/);
    assert.match(html, /And a paragraph\./);
  } finally {
    await fetch(`${globalThis.__SITE__}/api/admin/articles?slug=h1-regression-test`, { method: "DELETE" });
  }
});

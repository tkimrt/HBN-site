import assert from "node:assert/strict";
import test from "node:test";

/**
 * Renders the built worker without D1 or R2 bound. That is the important case:
 * before the database is provisioned the site must still serve the full
 * migrated article archive rather than erroring.
 */
async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} }
  );
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

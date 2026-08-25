import Link from "next/link";
import { ArrowIcon, AuthorCredit, PageShell, SubpageHero } from "../components";
import { excerpt } from "../markdown";
import { formatArticleDate, listArticles } from "../../lib/articles";

export const metadata = { title: "Articles & Insights" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await listArticles();
  const categories = [...new Set(all.map((a) => a.category))].sort();
  const active = category && categories.includes(category) ? category : null;
  const posts = active ? all.filter((a) => a.category === active) : all;
  const [lead, ...rest] = posts;

  return <PageShell>
    <SubpageHero
      eyebrow="Articles & insights"
      title="Ideas made useful."
      intro="200+ articles on homebuilding strategy, pricing, operations and leadership. Browse a sampling of 12 here."
    />

    <section className="article-index">
      <nav className="filter-row" aria-label="Filter articles by category">
        <Link href="/articles" className={active ? "" : "active"}>
          All <span className="filter-count">{all.length}</span>
        </Link>
        {categories.map((name) => (
          <Link
            key={name}
            href={`/articles?category=${encodeURIComponent(name)}`}
            className={active === name ? "active" : ""}
          >
            {name} <span className="filter-count">{all.filter((a) => a.category === name).length}</span>
          </Link>
        ))}
      </nav>

      {lead && (
        <Link href={`/articles/${lead.slug}`} className="article-lead">
          <div className="article-lead-image"><img src={lead.cover} alt="" /></div>
          <div className="article-lead-copy">
            <p className="tag">{lead.category} · {lead.minutes} min read</p>
            <h2>{lead.title}</h2>
            <p className="article-lead-kicker">{lead.kicker || excerpt(lead.body)}</p>
            <span className="read-more">Read article <ArrowIcon /></span>
          </div>
        </Link>
      )}

      <div className="article-list">
        {rest.map((post, i) => (
          <article key={post.slug}>
            <span className="article-index-number">{String(i + 2).padStart(2, "0")}</span>
            <div>
              <p className="tag">
                {post.category} · {post.minutes} min read
                {post.date && ` · ${formatArticleDate(post.date)}`}
              </p>
              <h2><Link href={`/articles/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.kicker || excerpt(post.body)}</p>
              <p className="article-byline"><AuthorCredit author={post.author} /></p>
            </div>
            <Link className="article-open" href={`/articles/${post.slug}`} aria-label={`Read ${post.title}`}>
              <ArrowIcon />
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && <p className="archive-note">No articles in this category yet.</p>}
    </section>
  </PageShell>;
}

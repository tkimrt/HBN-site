import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, PageShell } from "../../components";
import { Markdown, excerpt } from "../../markdown";
import { formatArticleDate, getArticle, listArticles } from "../../../lib/articles";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.kicker || excerpt(article.body),
    openGraph: { title: article.title, description: article.kicker, images: [article.cover] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = (await listArticles())
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  return <PageShell>
    <article className="article-page">
      <header className="article-head">
        <Link className="article-back" href="/articles">← All insights</Link>
        <p className="tag">{article.category}</p>
        <h1>{article.title}</h1>
        {article.kicker && <p className="article-standfirst">{article.kicker}</p>}
        <div className="article-meta">
          <span>{article.author}</span>
          {article.date && <span>{formatArticleDate(article.date)}</span>}
          <span>{article.minutes} min read</span>
        </div>
      </header>

      <div className="article-body">
        <Markdown body={article.body} />
      </div>
    </article>

    {related.length > 0 && (
      <section className="related-section">
        <div className="insights-head">
          <div><p className="eyebrow">Keep reading</p><h2>More insights.</h2></div>
        </div>
        <div className="article-grid">
          {related.map((post, i) => (
            <Link href={`/articles/${post.slug}`} className="article-card" key={post.slug}>
              {post.cover
                ? <div className="article-card-cover"><img src={post.cover} alt="" /></div>
                : <span className="article-card-index">0{i + 1}</span>}
              <p className="tag">{post.category}</p>
              <h3>{post.title}</h3>
              <p>{post.kicker || excerpt(post.body, 130)}</p>
              <span className="read-more">Read article <ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </section>
    )}
  </PageShell>;
}

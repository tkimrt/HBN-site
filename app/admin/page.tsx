import Link from "next/link";
import { ArrowIcon, PageShell } from "../components";
import { hasDatabase, hasStorage } from "../../db/storage";
import { formatArticleDate, listArticles } from "../../lib/articles";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const articles = await listArticles({ includeDrafts: true });
  const written = articles.filter((a) => a.source === "database");
  const archive = articles.filter((a) => a.source === "archive");

  return <PageShell>
    <section className="admin-head">
      <div>
        <p className="eyebrow">Article admin</p>
        <h1>The library.</h1>
        <p className="admin-intro">
          Write a new piece, or drop in a PDF and let it fill the editor. Everything published here
          appears immediately on <Link href="/articles">Insights</Link>.
        </p>
      </div>
      <div className="admin-head-actions">
        <Link className="button button-dark" href="/admin/new">New article <ArrowIcon /></Link>
        <Link className="button" href="/admin/events">Speaking events <ArrowIcon /></Link>
        <Link className="button" href="/admin/enquiries">Enquiries <ArrowIcon /></Link>
      </div>
    </section>

    <section className="admin-status" aria-label="Environment status">
      <div className={hasDatabase() ? "is-ok" : "is-warn"}>
        <strong>Database</strong>
        <span>{hasDatabase() ? "Database connected" : "Database not configured — publishing is unavailable"}</span>
      </div>
      <div className={hasStorage() ? "is-ok" : "is-warn"}>
        <strong>File storage</strong>
        <span>{hasStorage() ? "File storage connected" : "File storage not configured — uploads will fail"}</span>
      </div>
      <div className="is-warn">
        <strong>Access</strong>
        <span>Unprotected. Add authentication before launch.</span>
      </div>
    </section>

    <section className="admin-list">
      <h2>Written here <span className="admin-count">{written.length}</span></h2>
      {written.length === 0 ? (
        <p className="admin-empty">Nothing yet. <Link href="/admin/new">Write the first one</Link>.</p>
      ) : (
        <div className="admin-rows">
          {written.map((article) => (
            <div className="admin-row" key={article.slug}>
              <div>
                <p className="tag">
                  {article.category} · {article.minutes} min
                  {article.date && ` · ${formatArticleDate(article.date)}`}
                  {!article.published && " · draft"}
                </p>
                <h3>{article.title}</h3>
                <p className="admin-slug">/articles/{article.slug}</p>
              </div>
              <div className="admin-actions">
                <Link href={`/admin/edit/${article.slug}`}>Edit</Link>
                <Link href={`/articles/${article.slug}`}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="admin-archive-head">Migrated archive <span className="admin-count">{archive.length}</span></h2>
      <p className="admin-empty">
        These shipped with the site and are compiled into the build, so they cannot be edited here.
        To change one, edit its file under <code>content/articles/</code>.
      </p>
      <div className="admin-rows">
        {archive.map((article) => (
          <div className="admin-row is-locked" key={article.slug}>
            <div>
              <p className="tag">{article.category} · {article.minutes} min</p>
              <h3>{article.title}</h3>
              <p className="admin-slug">content/articles/{article.slug}.ts</p>
            </div>
            <div className="admin-actions">
              <Link href={`/articles/${article.slug}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  </PageShell>;
}

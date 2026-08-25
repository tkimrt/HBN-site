import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../../components";
import { ArticleEditor } from "../../editor";
import { getArticle } from "../../../../lib/articles";

export const metadata = { title: "Edit article" };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  if (article.source === "archive") {
    return <PageShell>
      <section className="admin-head">
        <div>
          <Link className="article-back" href="/admin">← Admin</Link>
          <h1>{article.title}</h1>
          <p className="admin-intro">
            This piece is part of the migrated archive and is compiled into the build.
            Edit <code>content/articles/{article.slug}.ts</code> and redeploy to change it.
          </p>
        </div>
      </section>
    </PageShell>;
  }

  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin">← Admin</Link>
        <h1>Edit article.</h1>
        <p className="admin-intro">/articles/{article.slug}</p>
      </div>
    </section>
    <section className="editor-section">
      <ArticleEditor
        mode="edit"
        initial={{
          slug: article.slug,
          title: article.title,
          kicker: article.kicker,
          category: article.category,
          author: article.author,
          date: article.date,
          cover: article.cover,
          pdf: article.pdf,
          body: article.body,
          published: article.published,
        }}
      />
    </section>
  </PageShell>;
}

import Link from "next/link";
import { PageShell } from "../../components";
import { ArticleEditor } from "../editor";

export const metadata = { title: "New article" };

export default function NewArticlePage() {
  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin">← Admin</Link>
        <h1>New article.</h1>
      </div>
    </section>
    <section className="editor-section">
      <ArticleEditor mode="new" />
    </section>
  </PageShell>;
}

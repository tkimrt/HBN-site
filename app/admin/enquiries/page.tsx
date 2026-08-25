import Link from "next/link";
import { PageShell } from "../../components";
import { emailConfigured, contactRecipient } from "../../../lib/email";
import { formatEnquiryDate, listEnquiries } from "../../../lib/enquiries";

export const metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();
  const configured = emailConfigured();

  return <PageShell>
    <section className="admin-head">
      <div>
        <Link className="article-back" href="/admin">← Admin</Link>
        <h1>Enquiries.</h1>
        <p className="admin-intro">
          Everything submitted through <Link href="/contact">the contact form</Link>. Stored here
          first, then emailed — so nothing is lost if mail is down or not set up.
        </p>
      </div>
    </section>

    <section className="admin-status">
      <div className={configured ? "is-ok" : "is-warn"}>
        <strong>Email delivery</strong>
        <span>
          {configured
            ? `Forwarding to ${contactRecipient()}`
            : "Not configured — set RESEND_API_KEY. Enquiries are still captured below."}
        </span>
      </div>
    </section>

    <section className="admin-list">
      <h2>Received <span className="admin-count">{enquiries.length}</span></h2>
      {enquiries.length === 0 ? (
        <p className="admin-empty">Nothing yet.</p>
      ) : (
        <div className="enquiry-list">
          {enquiries.map((enquiry) => (
            <article className="enquiry" key={enquiry.id}>
              <header>
                <div>
                  <h3>{enquiry.name}{enquiry.company && <span className="enquiry-company"> · {enquiry.company}</span>}</h3>
                  <p className="enquiry-meta">
                    {formatEnquiryDate(enquiry.createdAt)}
                    {enquiry.interest && ` · ${enquiry.interest}`}
                    {enquiry.emailStatus && enquiry.emailStatus !== "sent" && (
                      <span className="enquiry-flag"> · email {enquiry.emailStatus}</span>
                    )}
                  </p>
                </div>
                <div className="enquiry-contact">
                  <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
                  {enquiry.phone && <a href={`tel:${enquiry.phone.replace(/[^\d+]/g, "")}`}>{enquiry.phone}</a>}
                </div>
              </header>
              <p className="enquiry-message">{enquiry.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  </PageShell>;
}

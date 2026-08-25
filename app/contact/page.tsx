import { PageShell } from "../components";
import { ContactForm } from "./form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <PageShell>
    <section className="contact-page">
      <div className="contact-intro">
        <p className="eyebrow light">Start a conversation</p>
        <h1>Tell us what’s<br />keeping you<br /><em>up at night.</em></h1>
        <p>No pitch deck, no pressure. Just two builders talking.</p>
        <div className="contact-direct">
          <a href="tel:18008234344">800 823 4344</a>
          <a href="mailto:admin@hbnnet.com">admin@hbnnet.com</a>
        </div>
      </div>
      <ContactForm />
    </section>
  </PageShell>;
}

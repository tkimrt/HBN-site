import { PageShell } from "../components";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <PageShell>
    <section className="contact-page">
      <div className="contact-intro"><p className="eyebrow light">Start a conversation</p><h1>Tell us what’s<br />keeping you<br /><em>up at night.</em></h1><p>No pitch deck. No pressure. Just two builders talking about what is possible.</p><div className="contact-direct"><a href="tel:18008234344">800 823 4344</a><a href="mailto:admin@hbnnet.com">admin@hbnnet.com</a></div></div>
      <form className="contact-form"><label>Full name<input type="text" name="name" autoComplete="name" placeholder="Your name" /></label><label>Company<input type="text" name="company" autoComplete="organization" placeholder="Company name" /></label><div className="form-row"><label>Email<input type="email" name="email" autoComplete="email" placeholder="you@company.com" /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" placeholder="(555) 555-5555" /></label></div><label>I’m interested in<select name="interest" defaultValue=""><option value="" disabled>Select one</option><option>Coaching & consulting</option><option>Land planning / TINS</option><option>Speaking / 20 Clubs</option><option>Home plans</option><option>Something else</option></select></label><label>Tell us more<textarea name="message" rows={5} placeholder="Your market, your business, and the challenge in front of you..." /></label><button className="button button-dark" type="submit">Send message <span aria-hidden="true">↗</span></button></form>
    </section>
  </PageShell>;
}

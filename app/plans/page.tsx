import { InlineLink, PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Home Plans" };

const collections = [
  ["01", "HBN Plans", "Exclusive concept plans & neighborhood collections", "A searchable catalog of copyrighted concept plans, available individually or as curated six-plan neighborhood collections—with geographic exclusivity for your market."],
  ["02", "Values That Matter™", "Proven plans. Built over 1,000 times.", "More than 70 flexible, economical plans designed around affordability, lifestyle, functionality, aesthetics, and sustainability. Built by 30+ builders nationwide."],
  ["03", "Royal Oaks Design", "From concept to construction-ready", "HBN-designed plans with full construction drawing capability and a modification team for builders who need a plan tailored to their specifications."],
];

export default function PlansPage() {
  return <PageShell>
    <SubpageHero eyebrow="Home plans" title="Build what sells." intro="Every builder’s lineup should start with how a plan builds, how it sells, and how it sits on the lot—not architectural vanity." image="/images/modern-home.jpg" imageAlt="Contemporary home exterior" />
    <section className="collection-section">
      <SectionHeading eyebrow="Three ways in" title="The right plan, at the right level of finish." text="Choose an exclusive concept collection, a proven value-engineered portfolio, or a construction-ready path." />
      <div className="collection-list">{collections.map(([n, name, title, copy]) => <article className="collection-item" key={n}><span>{n}</span><div><p className="tag">{name}</p><h3>{title}</h3></div><div><p>{copy}</p><InlineLink href="/contact">Ask about this collection</InlineLink></div></article>)}</div>
    </section>
    <section className="decision-block"><p className="eyebrow light">Not sure which fits?</p><h2>Tell us about your market, lots, and price points.</h2><InlineLink href="/contact">Find the right collection</InlineLink></section>
  </PageShell>;
}


import { ArrowIcon, PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Home Plans" };

const collections = [
  ["01", "HBN Plans", "Exclusive concept plans & neighborhood collections", "A searchable catalog of copyrighted concept plans, available individually or as curated six-plan neighborhood collections—with geographic exclusivity for your market.", "https://hbnplans.com/", "See HBN Plans"],
  ["02", "Values That Matter\u2122", "Proven plans. Built over 1,000 times.", "More than 70 flexible, economical plans designed around affordability, lifestyle, functionality, aesthetics, and sustainability. Built by 30+ builders nationwide.", "https://www.valuesthatmatter.net", "See Values That Matter"],
  ["03", "Royal Oaks Design", "From concept to construction-ready", "HBN/Royal Oaks Design designed plans with full construction drawing capability and a modification team for builders who need a plan tailored to their specifications.", "https://royaloaksdesign.com/search?q=hbn", "See Royal Oaks Design"],
];

export default function PlansPage() {
  return <PageShell>
    <SubpageHero
      eyebrow="Home plans"
      title="Build what sells."
      intro="Every builder’s lineup should start with how a plan builds, how it sells, and how it sits on the lot—not architectural vanity."
      image="/images/hemlock-elevation.jpg"
      imageAlt="Front elevation rendering of the Hemlock house plan"
      imageFit="contain"
      imageCaption="The Hemlock model from the HBN/Royal Oaks Design Collection"
    />
    <section className="collection-section">
      <SectionHeading eyebrow="Three ways in" title="The right plan, at the right level of finish." />
      <div className="collection-list">
        {collections.map(([n, name, title, copy, href, linkLabel]) => (
          <article className="collection-item" key={n}>
            {/* The number is the outbound link to each collection's own site. */}
            <a className="collection-number" href={href} target="_blank" rel="noreferrer noopener" aria-label={`${name} (opens in a new window)`}>{n}</a>
            <div><p className="tag">{name}</p><h3>{title}</h3></div>
            <div>
              <p>{copy}</p>
              <a className="inline-link" href={href} target="_blank" rel="noreferrer noopener">
                {linkLabel} <ArrowIcon />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  </PageShell>;
}

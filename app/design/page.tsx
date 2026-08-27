import { InlineLink, PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Design Services" };

const services = [
  ["01", "Concept plan library", "Over 400 concept plans, available overnight", "A searchable database of concept plans delivered at ⅛\" scale with colored elevation renderings — built to help you develop a new product line or extend the one you have."],
  ["02", "Portfolio design", "Homes that work as a collection", "A coordinated set of designs for a single development, so the streetscape has visual interest and architectural delight while staying practical to build and easy to sell."],
  ["03", "Elevation variations", "More curb appeal, same floor plan", "Add multiple elevations to plans you already build. You simplify construction and increase efficiency without carrying the cost of duplicate floor plans."],
  ["04", "Land planning", "Raw land to finished lots", "Maximise value through the conversion — lot mix optimisation, product fit, and a pricing strategy that captures what the plan created."],
];

const benefits = [
  "Stronger buyer appeal at the same square footage",
  "Fewer framing surprises and better construction efficiency",
  "Room arrangements that flex to more than one buyer profile",
  "Pre-designed options — media walls, drop zones, flex rooms — priced and ready",
];

export default function DesignPage() {
  return <PageShell>
    <SubpageHero
      eyebrow="Design services"
      title="Design is a profit decision."
      intro="Home design, land planning and marketing under one vision — so the plan you build is the plan the market is asking for."
      image="/images/design-services.jpg"
      imageAlt="Hand-drawn floor plan sketches and an architect's scale on a designer's desk"
      tone="clay"
    />

    <section className="collection-section">
      <SectionHeading
        eyebrow="What we do"
        title="Four ways to strengthen your product."
      />
      <div className="collection-list">
        {services.map(([n, name, title, copy]) => (
          <article className="collection-item" key={n}>
            <span>{n}</span>
            <div><p className="tag">{name}</p><h3>{title}</h3></div>
            <div><p>{copy}</p><InlineLink href="/contact">Ask about this service</InlineLink></div>
          </article>
        ))}
      </div>
    </section>

    <section className="benefit-band">
      <div className="benefit-copy">
        <p className="eyebrow light">Why revise a plan you already sell</p>
        <h2>The cheapest square footage you will ever add is the kind you don’t build.</h2>
      </div>
      <ul className="benefit-list">
        {benefits.map((item, i) => (
          <li key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</li>
        ))}
      </ul>
    </section>

    <section className="engagements">
      <SectionHeading eyebrow="Also available" title="Renderings, from $250 an image." />
      <div className="engagement-cta"><InlineLink href="/renderings">See the rendering service</InlineLink></div>
    </section>
  </PageShell>;
}

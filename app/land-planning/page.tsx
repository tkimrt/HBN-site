import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Land Planning" };

const pillars = [
  ["Land plan optimization", "Compare layout scenarios across density, lot diversity, open space, and total risk-adjusted return."],
  ["Product-lot integration", "Design the lineup so every home fits the lot, grade, orientation, and story buyers see from the curb."],
  ["Lot premium strategy", "Price every lot on seven measurable characteristics. No batch pricing. No guessing."],
  ["Streetscape planning", "Coordinate plans and elevations for architectural variety without creating construction chaos."],
  ["Amenity strategy", "Use entrances, open space, preserved trees, and gathering areas as intentional value creators."],
];
const engagements = [["Land plan review", "Expert recommendations before the layout is locked."], ["Product lineup development", "A four-step path from envisioned lineup to purpose-built plans."], ["Lot premium optimization", "A defensible premium schedule for lots already on the ground."], ["Full TINS engagement", "From raw site through product, pricing, and elevation strategy."]];

export default function LandPlanningPage() {
  return <PageShell>
    <SubpageHero eyebrow="Land planning" title="The land plan is where profits are made — or lost." intro="Totally Integrated Neighborhood Solutions treats the land plan, product lineup, and pricing as one system, because that is how buyers experience them." image="/images/land-planning.jpg" imageAlt="Aerial view of a planned residential community" tone="green" />
    <section className="tins-intro"><div><p className="eyebrow">The TINS method</p><h2>Maximum profitability.<br />Maximum velocity.</h2></div><p>Most subdivisions optimize lot yield. We optimize the community. That means the lots feel different, the product fits, the streetscape has character, and pricing captures the financial value of every quality difference.</p></section>
    <section className="pillar-section"><div className="pillar-list">{pillars.map(([title, copy], i) => <article key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="results-band"><div><strong>$50K–$150K+</strong><span>potential additional lot premium revenue on a typical 40-lot community</span></div><div><strong>Faster</strong><span>absorption through meaningful lot and product variety</span></div><div><strong>Higher</strong><span>margins from product that fits the site</span></div></section>
    <section className="engagements"><SectionHeading eyebrow="Ways to work together" title="Bring us in before the first line is drawn — or before the next lot is priced." /><div className="engagement-grid">{engagements.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  </PageShell>;
}


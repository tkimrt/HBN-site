import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Renderings" };

const priced = [
  ["Exterior elevation renderings", "from $350", "Traditional, Craftsman, Cottage, American Farmhouse and Country French. The image a buyer remembers after they leave."],
  ["Floor plan renderings", "from $250", "Room relationships and flow, shown the way a buyer actually reads a home — without the confusion of construction lines."],
];

const also = [
  ["Perspective renderings", "Three-quarter views that put the home on its lot, in its street, at the right time of day."],
  ["Site map renderings", "The community at a glance — lots, amenities, open space and what makes each location different."],
  ["Commercial structures", "Mixed-use, clubhouse and amenity buildings rendered to the same standard."],
];

export default function RenderingsPage() {
  return <PageShell>
    <SubpageHero
      eyebrow="Renderings"
      title="Show the home before you build it."
      intro="Buyers who cannot picture the home cannot commit to it. Renderings remove that uncertainty, and open the conversation about upgrades before the buyer has decided what they want."
      image="/images/renderings.jpg"
      imageAlt="A watercolour architectural elevation rendering pinned to a studio wall"
    />

    <section className="collection-section">
      <SectionHeading
        eyebrow="Pricing"
        title="Formal architectural renderings cost thousands. These don’t."
      />
      <div className="price-grid">
        {priced.map(([title, price, copy]) => (
          <article key={title}>
            <p className="price-tag">{price}</p>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <div className="engagement-grid rendering-extras">
        {also.map(([title, copy]) => (
          <article key={title}><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </div>
    </section>
  </PageShell>;
}

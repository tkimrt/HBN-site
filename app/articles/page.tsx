import { PageShell, SubpageHero } from "../components";

export const metadata = { title: "Articles & Insights" };

const posts = [
  ["Pricing", "What builders can learn from restaurants about pricing", "The Ruth’s Chris Principle and what menu engineering teaches us about options, upgrades, and lot premiums."],
  ["Sales", "You’re not selling a house. You’re selling a decision.", "Four dimensions of buyer commitment—and how to address all four."],
  ["Strategy", "What’s everyone else doing?", "The difference between benchmarking and copying."],
  ["Strategy", "The five constraints", "A diagnostic for land, capital, people, trades, and sales."],
  ["Marketing", "Silent salesmen", "The touchpoints that sell when your team is not there."],
  ["Construction", "The fog of construction", "What friction teaches us about cycle time and scheduling."],
];

export default function ArticlesPage() {
  return <PageShell>
    <SubpageHero eyebrow="Articles & insights" title="Ideas made useful." intro="More than 200 articles on homebuilding strategy, operations, and leadership—written from 54 years of building, consulting, and coaching." />
    <section className="article-index"><div className="filter-row" aria-label="Article categories"><span className="active">All</span><span>Pricing</span><span>Land planning</span><span>Sales</span><span>Product</span><span>Leadership</span><span>Construction</span></div><div className="article-list">{posts.map(([tag, title, copy], i) => <article key={title}><span className="article-index-number">{String(i + 1).padStart(2, "0")}</span><div><p className="tag">{tag}</p><h2>{title}</h2><p>{copy}</p></div><span className="coming">Coming soon</span></article>)}</div><p className="archive-note">Article archive migration is in progress. The complete 200+ article library will be available here, organized by topic and searchable.</p></section>
  </PageShell>;
}


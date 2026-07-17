import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Coaching & Consulting" };

const functions = ["Vision & values", "Leadership & strategy", "Land acquisition", "Product development", "Estimating", "Purchasing", "Pricing", "Finance", "Accounting", "Marketing", "Sales", "Selections", "Human resources", "Construction", "Warranty & service"];
const process = [["01", "Assess", "Financial performance, organization, market position, product, land pipeline, and your biggest constraint."], ["02", "Focus", "A specific strategy built around your market, your team, and the ambition you are ready to support."], ["03", "Execute", "Monthly check-ins, on-site visits, financial reviews, and real-time operator-level problem solving."], ["04", "Measure", "Closings, margins, cycle time, customer satisfaction, and retention. If it is not moving, we change it."]];

export default function ConsultingPage() {
  return <PageShell>
    <SubpageHero eyebrow="Coaching & consulting" title="Your competitive advantage, embedded." intro="We don’t drop in for a day and hand you a binder. We become part of your team and stay close to the decisions that move the business." image="/images/blueprint-review.jpg" imageAlt="A team reviewing architectural plans" tone="clay" />
    <section className="functions-section"><SectionHeading eyebrow="The whole business" title="All 15 functions. One operating system." text="Most builders are strong in three or four and winging the rest. We close the gaps." /><div className="function-grid">{functions.map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</div>)}</div></section>
    <section className="process-section"><SectionHeading eyebrow="How we work" title="Stay close. Get specific. Measure what matters." /><div className="process-grid">{process.map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="quote-block compact"><div className="quote-symbol">“</div><blockquote>Al’s ability to appraise the current opportunity or issue and immediately provide practical solutions is unlike anything else in this industry.</blockquote><p>Client testimonial</p></section>
  </PageShell>;
}


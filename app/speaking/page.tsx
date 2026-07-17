import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "Speaking & 20 Clubs" };

const talks = ["The 15 Functions of Home Building", "Land Planning for Profit", "The Art and Science of Pricing", "Product Development: Building What Sells", "Selling the Decision, Not the House", "From Market to Move-In: AI in Homebuilding"];

export default function SpeakingPage() {
  return <PageShell>
    <SubpageHero eyebrow="Speaking & 20 Clubs" title="Make the room smarter." intro="Al speaks at national conferences, HBA events, corporate meetings, and builder 20 Clubs on the topics that move the needle for homebuilders." image="/images/speaking-stage.jpg" imageAlt="A speaker addressing a conference audience" tone="green" />
    <section className="upcoming-event"><div><p className="eyebrow">Upcoming · July 2026</p><h2>PCBC San Diego</h2></div><div><h3>From Market to Move-In: How AI is Changing Homebuilding</h3><p>Co-presented with Michael Bergin of Higharc. A live case study in market intelligence, product selection, marketing, and AI-powered floor plan redesign.</p></div></section>
    <section className="talks-section"><SectionHeading eyebrow="Signature presentations" title="The business of building, without the boilerplate." text="Every presentation is tailored to the audience—from an intimate 20 Club to a 500-seat conference hall." /><div className="talk-list">{talks.map((talk, i) => <div key={talk}><span>{String(i + 1).padStart(2, "0")}</span><h3>{talk}</h3></div>)}</div></section>
    <section className="club-section"><div><p className="eyebrow light">20 Club facilitation</p><h2>Candid advice among non-competing peers.</h2></div><div><p>Al facilitates builder groups that share financial data, best practices, and hard-won lessons. Each meeting combines benchmarking, operational deep-dives, structured problem solving, and individual coaching.</p><p className="club-callout">15–20 builders. Different markets. Shared accountability.</p></div></section>
  </PageShell>;
}


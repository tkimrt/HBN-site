import Link from "next/link";
import { ArrowIcon, Footer, Header, InlineLink } from "./components";

const services = [
  { n: "01", title: "Land planning", copy: "Make the land plan, product lineup, and pricing work as one profit system.", href: "/land-planning", image: "/images/neighborhood-aerial.jpg" },
  { n: "02", title: "Coaching & consulting", copy: "Operator-level guidance across all 15 functions of homebuilding, embedded with your team.", href: "/consulting", image: "/images/blueprint-review.jpg" },
  { n: "03", title: "Home plans", copy: "Exclusive, proven, and construction-ready paths for builders who want to build what sells.", href: "/plans", image: "/images/modern-home.jpg" },
];

const articles = [
  ["Pricing", "What builders can learn from restaurants about pricing", "The Ruth’s Chris Principle and what menu engineering teaches us about presenting options, upgrades, and lot premiums."],
  ["Sales", "You’re not selling a house. You’re selling a decision.", "The four dimensions of buyer commitment—and why most sales teams only address one."],
  ["Strategy", "The five constraints", "Land, capital, people, trades, sales. Every builder’s growth ceiling is one of these five."],
];

export default function Home() {
  return <><Header /><main>
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">Homebuilding strategy · Since 1991</p>
        <h1>We make builders<br /><em>more profitable.</em></h1>
        <p>For 35 years, Home Builders Network has helped builders turn land into neighborhoods, plans into products, and uncertainty into strategy.</p>
        <Link className="button" href="/contact">Talk to us <ArrowIcon /></Link>
      </div>
      <div className="hero-photo"><img src="/images/neighborhood-aerial.jpg" alt="Aerial view of a residential neighborhood" /></div>
      <div className="hero-stat"><strong>48</strong><span>active builder clients<br />across North America</span></div>
    </section>

    <section className="proof-strip" aria-label="Company statistics">
      <div><strong>54</strong><span>years in homebuilding</span></div>
      <div><strong>8</strong><span>developments as partners</span></div>
      <div><strong>10</strong><span>builder company sales advised</span></div>
      <div><strong>200+</strong><span>articles published</span></div>
    </section>

    <section className="services-section">
      <div className="services-intro">
        <p className="eyebrow">What we do</p>
        <h2>Every decision shapes<br />the bottom line.</h2>
        <p>We connect the parts of homebuilding that are too often managed in isolation—land, product, pricing, sales, and operations.</p>
      </div>
      <div className="service-list">
        {services.map((service) => <article className="service-row" key={service.n}>
          <span className="service-number">{service.n}</span>
          <div className="service-image"><img src={service.image} alt="" /></div>
          <div className="service-copy"><h3>{service.title}</h3><p>{service.copy}</p><InlineLink href={service.href}>Explore service</InlineLink></div>
        </article>)}
      </div>
    </section>

    <section className="quote-block">
      <div className="quote-symbol">“</div>
      <blockquote>20+ years and ‘THE MAN’ still brings it. Our success is a direct result of Al’s advice.</blockquote>
      <p>Todd Pohlig · The Pohlig Companies</p>
    </section>

    <section className="insights-section">
      <div className="insights-head"><div><p className="eyebrow">From the field</p><h2>Insights for builders.</h2></div><InlineLink href="/articles">View all articles</InlineLink></div>
      <div className="article-grid">
        {articles.map(([tag, title, text], i) => <Link href="/articles" className="article-card" key={title}>
          <span className="article-index">0{i + 1}</span><p className="tag">{tag}</p><h3>{title}</h3><p>{text}</p><span className="read-more">Read article <ArrowIcon /></span>
        </Link>)}
      </div>
    </section>

    <section className="speaking-band">
      <div className="speaking-photo"><img src="/images/speaking-stage.jpg" alt="Speaker presenting to a conference audience" /></div>
      <div className="speaking-copy"><p className="eyebrow light">Upcoming · July 2026</p><h2>From market<br />to move-in.</h2><p>How AI is changing homebuilding—live at PCBC San Diego with Michael Bergin of Higharc.</p><Link className="button button-light" href="/speaking">Speaking & 20 Clubs <ArrowIcon /></Link></div>
    </section>
  </main><Footer /></>;
}


import Link from "next/link";
import { ArrowIcon, Footer, Header, InlineLink } from "./components";
import { excerpt } from "./markdown";
import { listArticles } from "../lib/articles";
import { formatEventMonth, getNextEvent, isUpcoming } from "../lib/events";

const services = [
  { n: "01", title: "Land planning", copy: "Make the land plan, product lineup, and pricing work as one profit system.", href: "/land-planning", image: "/images/land-planning.jpg" },
  { n: "02", title: "Coaching & consulting", copy: "Operator-level guidance across all 15 functions of homebuilding, embedded with your team.", href: "/consulting", image: "/images/consulting.jpg" },
  { n: "03", title: "Design & renderings", copy: "Over 400 concept plans, portfolio design, elevation variations, and renderings that sell before you build.", href: "/design", image: "/images/design-services.jpg" },
  { n: "04", title: "Home plans", copy: "Exclusive, proven, and construction-ready paths for builders who want to build what sells.", href: "/plans", image: "/images/plans.jpg" },
];

export default async function Home() {
  const [articles, nextEvent] = await Promise.all([
    listArticles().then((all) => all.slice(0, 3)),
    getNextEvent(),
  ]);

  return <><Header /><main>
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <h1 id="home-hero-title">We make<br />builders more<br />profitable.</h1>
      </div>
      <div className="home-hero-photo">
        <img src="/images/hero-elevation.jpg" alt="Front elevation of a two-storey home with stone and board-and-batten siding" />
      </div>
    </section>

    <section className="proof-strip" aria-label="Company statistics">
      <div><strong>54</strong><span>years in homebuilding</span></div>
      <div><strong>8</strong><span>developments as partners</span></div>
      <div><strong>10</strong><span>builder ownership transitions advised</span></div>
      <div><strong>200+</strong><span>articles published</span></div>
    </section>

    <section className="services-section">
      <div className="services-intro">
        <div>
          <p className="eyebrow">What we do</p>
          <h2>Every decision shapes<br />the bottom line.</h2>
        </div>
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

    <section className="insights-section">
      <div className="insights-head">
        <div><p className="eyebrow">Understanding our business</p><h2>Insights for builders.</h2></div>
        <InlineLink href="/articles">View all articles</InlineLink>
      </div>
      <div className="article-grid">
        {articles.map((post, i) => <Link href={`/articles/${post.slug}`} className="article-card" key={post.slug}>
          {post.cover
            ? <div className="article-card-cover"><img src={post.cover} alt="" /></div>
            : <span className="article-card-index">0{i + 1}</span>}
          <p className="tag">{post.category}</p>
          <h3>{post.title}</h3>
          <p>{post.kicker || excerpt(post.body, 140)}</p>
          <span className="read-more">Read article <ArrowIcon /></span>
        </Link>)}
      </div>
    </section>

    {nextEvent && (<>
      <section className="podium-head">
        <p className="eyebrow">From the podium</p>
        <h2>Upcoming events.</h2>
      </section>

      <section className="speaking-band">
        <div className="speaking-photo">
          <img src={nextEvent.cover || "/images/speaking.jpg"} alt="A speaker presenting to a conference audience" />
        </div>
        <div className="speaking-copy">
          <p className="eyebrow light">{isUpcoming(nextEvent.date) ? "Upcoming" : "Most recent"} · {formatEventMonth(nextEvent.date)}</p>
          <h2>{nextEvent.name}</h2>
          <p>{nextEvent.title}</p>
          <div className="speaking-actions">
            {nextEvent.url && (
              <a className="button button-light" href={nextEvent.url} target="_blank" rel="noreferrer noopener">
                Registration <ArrowIcon />
              </a>
            )}
            <Link className="inline-link" href="/speaking">Speaking &amp; 20 Clubs <ArrowIcon /></Link>
          </div>
        </div>
      </section>
    </>)}

    <section className="quote-block">
      <div className="quote-symbol">“</div>
      <blockquote>30+ years and ‘THE MAN’ still brings it. Our success is a direct result of Al’s advice.</blockquote>
      <p>Todd Pohlig · The Pohlig Companies</p>
    </section>
  </main><Footer /></>;
}

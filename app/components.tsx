import Link from "next/link";

export const navItems = [
  ["Land planning", "/land-planning"],
  ["Consulting", "/consulting"],
  ["Plans", "/plans"],
  ["Speaking", "/speaking"],
  ["Insights", "/articles"],
] as const;

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Home Builders Network home">
        <span className="brand-mark">HBN</span>
        <span className="brand-name">Home Builders<br />Network</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <Link className="header-cta" href="/contact">Talk to us <ArrowIcon /></Link>
      <details className="mobile-menu">
        <summary aria-label="Open menu">Menu</summary>
        <div className="mobile-menu-panel">
          {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/about">About</Link>
          <Link href="/contact">Talk to us</Link>
        </div>
      </details>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-lead">
        <p className="eyebrow light">Ready when you are</p>
        <h2>Let’s build a more<br />profitable business.</h2>
        <Link className="button button-light" href="/contact">Start a conversation <ArrowIcon /></Link>
      </div>
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-brand">HBN</Link>
          <p>Making builders more<br />profitable since 1991.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <p className="footer-label">Company</p>
          <Link href="/about">About Al</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <p className="footer-label">Get in touch</p>
          <a href="tel:18008234344">800 823 4344</a>
          <a href="mailto:admin@hbnnet.com">admin@hbnnet.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Home Builders Network</span>
        <span>United States · Canada · Mexico</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

export function SubpageHero({ eyebrow, title, intro, image, imageAlt, tone = "cream" }: {
  eyebrow: string; title: string; intro: string; image?: string; imageAlt?: string; tone?: "cream" | "green" | "clay";
}) {
  return (
    <section className={`subhero subhero-${tone} ${image ? "has-image" : ""}`}>
      <div className="subhero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subhero-intro">{intro}</p>
      </div>
      {image && <div className="subhero-image"><img src={image} alt={imageAlt ?? ""} /></div>}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="inline-link" href={href}>{children} <ArrowIcon /></Link>;
}


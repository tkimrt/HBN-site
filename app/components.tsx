import Link from "next/link";

export const navItems = [
  ["Consulting", "/consulting"],
  ["Land planning", "/land-planning"],
  ["Design", "/design"],
  ["Plans", "/plans"],
  ["Speaking", "/speaking"],
  ["Insights", "/articles"],
] as const;

const moreItems = [
  ["Renderings", "/renderings"],
  ["Builder tools", "/resources"],
  ["About", "/about"],
] as const;

export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <img
      className="logo-img"
      src={variant === "light" ? "/brand/hbn-logo-light.png" : "/brand/hbn-logo.png"}
      /* Decorative: the wrapping link carries the accessible name. */
      alt=""
      width={236}
      height={146}
    />
  );
}

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Home Builders Network — home">
        <Logo />
        <span className="brand-name" aria-hidden="true">Home Builders<br />Network</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <Link className="header-cta" href="/contact">Talk to us <ArrowIcon /></Link>
      <details className="mobile-menu">
        <summary aria-label="Open menu">Menu</summary>
        <div className="mobile-menu-panel">
          {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          {moreItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
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
          <Link href="/" className="footer-brand" aria-label="Home Builders Network — home">
            <Logo variant="light" />
          </Link>
          <p>Making builders more<br />profitable since 1991.</p>
        </div>
        <div>
          <p className="footer-label">Services</p>
          {navItems.slice(0, 5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/renderings">Renderings</Link>
        </div>
        <div>
          <p className="footer-label">Library</p>
          <Link href="/articles">Insights</Link>
          <Link href="/resources">Free builder tools</Link>
          <Link href="/about">About Al</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <p className="footer-label">Get in touch</p>
          <a href="tel:18008234344">800 823 4344</a>
          <a href="mailto:admin@hbnnet.com">admin@hbnnet.com</a>
          <p className="footer-address">6200 Georgetown Blvd, Suite F<br />Eldersburg, MD 21784</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Home Builders Network. All rights reserved.</span>
        <span>United States · Canada · Mexico</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

export function SubpageHero({ eyebrow, title, intro, image, imageAlt, imageCaption, imageFit = "cover", tone = "cream" }: {
  eyebrow: string; title: string; intro: string; image?: string; imageAlt?: string;
  imageCaption?: string; imageFit?: "cover" | "contain"; tone?: "cream" | "green" | "clay";
}) {
  return (
    <section className={`subhero subhero-${tone} ${image ? "has-image" : ""}`}>
      <div className="subhero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subhero-intro">{intro}</p>
      </div>
      {image && (
        /* "contain" is for drawings — an elevation must be shown whole, and the
           panel is taller than a wide rendering, so cover would crop it. */
        <div className={`subhero-image subhero-image-${imageFit}`}>
          <img src={image} alt={imageAlt ?? ""} />
          {imageCaption && <figcaption className="subhero-caption">{imageCaption}</figcaption>}
        </div>
      )}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="inline-link" href={href}>{children} <ArrowIcon /></Link>;
}

const ATLAS = "Atlas by RealTorch";

/** Author line with every mention of Atlas by RealTorch linked to realtorch.ai. */
export function AuthorCredit({ author }: { author: string }) {
  if (!author.includes(ATLAS)) return <>{author}</>;
  const parts = author.split(ATLAS);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a className="atlas-link" href="https://www.realtorch.ai" target="_blank" rel="noreferrer noopener">
              {ATLAS}
            </a>
          )}
        </span>
      ))}
    </>
  );
}

export function DownloadIcon() {
  return <span aria-hidden="true">↓</span>;
}

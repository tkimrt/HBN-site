import { PageShell, SectionHeading, SubpageHero } from "../components";

export const metadata = { title: "About" };

export default function AboutPage() {
  return <PageShell>
    <SubpageHero eyebrow="About Home Builders Network" title="Builder. Developer. Advisor. Teacher." intro="Al Trellis has spent 54 years in homebuilding—seeing the business from every angle, then helping builders make better decisions." tone="green" />
    <section className="profile-section">
      <div className="profile-card"><span className="profile-initials">AT</span><div><p>Al Trellis</p><span>Founder & President</span></div></div>
      <div className="profile-copy">
        <p className="lead">Al is the founder and president of Home Builders Network, working with 48 home building companies across the United States and Canada—from 10-unit custom builders to a 525-unit-per-year production operation.</p>
        <div className="two-col-copy">
          <p>Over the course of his career, Al has been a partner in eight residential developments and advised on the sale of 10 homebuilding companies. He created the 15 Functions of Home Building framework and the Totally Integrated Neighborhood Solutions methodology for land planning.</p>
          <p>He has authored more than 200 articles and speaks frequently at PCBC, IBS, and state and regional HBA events. His work spans land, product, pricing, sales, construction, finance, and organizational leadership.</p>
        </div>
      </div>
    </section>
    <section className="number-wall"><SectionHeading eyebrow="Experience, applied" title="Not theory. Pattern recognition earned over decades." /><div className="number-grid"><div><strong>54</strong><span>years in the industry</span></div><div><strong>35</strong><span>years as HBN</span></div><div><strong>48</strong><span>active clients</span></div><div><strong>3</strong><span>countries served</span></div></div></section>
  </PageShell>;
}


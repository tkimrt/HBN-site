/**
 * Al's home building industry programs.
 *
 * `formats` records which lengths each program is offered in, taken from the
 * client's programs matrix. The speaking page renders one icon per format and
 * keys them against the format strip, so adding a program here is all that is
 * needed to publish it.
 */

export type ProgramFormat = "keynote" | "industry" | "workshop";

export type Program = {
  title: string;
  formats: ProgramFormat[];
  summary: string;
};

export const PROGRAM_FORMATS: Record<ProgramFormat, { label: string; length: string }> = {
  keynote: { label: "Keynote", length: "20–40 min" },
  industry: { label: "Industry program", length: "1–3 hrs" },
  workshop: { label: "Workshop", length: "4–6 hrs" },
};

export const FORMAT_ORDER: ProgramFormat[] = ["keynote", "industry", "workshop"];

export const programs: Program[] = [
  {
    title: "Beyond the Base Price: Maximizing Profitability Through Strategic Pricing",
    formats: ["keynote", "industry"],
    summary:
      "Pricing as a strategic tool for improving profitability, strengthening market position, and communicating value. Covers logical, competitive and consistent pricing; buyer psychology and market intelligence; and practical approaches to pricing homes, lots, options, upgrades, bundles and promotions while balancing customer appeal, sales velocity and healthy margins.",
  },
  {
    title: "Sales Are About…",
    formats: ["industry"],
    summary:
      "The key elements that work together to drive new-home sales. Explores generating traffic, establishing competitive and logical pricing, delivering genuine customer value, offering appealing and functional products, maintaining the right inventory, selecting strong locations, and supporting it all with effective salesmanship and a clear understanding of the target buyer.",
  },
  {
    title: "Product-Pricing-Sales: The Keys to Success",
    formats: ["workshop"],
    summary:
      "A three-part program on how product development, pricing and sales must work together to create value, strengthen market position and improve profitability. Covers buyer-focused product design and research, strategic and market-based pricing, and disciplined sales practices — emphasising alignment among all three to deliver more predictable results.",
  },
  {
    title: "10 Practical Ways A.I. Can Help Home Builders",
    formats: ["keynote", "industry"],
    summary:
      "Practical ways home builders can use artificial intelligence to improve everyday operations and profitability. Covers applications from research, writing, training and human resources to pricing, market analysis, customer engagement and sales, while emphasising effective prompting, experimentation, and the growing importance of adopting A.I. as a competitive tool.",
  },
  {
    title: "From Feeble Financials to Exceptional Earnings",
    formats: ["workshop"],
    summary:
      "Practical ways home builders can improve profitability through stronger pricing, cost control, overhead management and increased sales. Explains the key financial concepts while exploring how better market intelligence, product decisions, purchasing, inventory, marketing and sales practices can produce meaningful improvements in overall financial performance.",
  },
  {
    title: "Scaling Your Business Growth with Purpose",
    formats: ["keynote", "industry"],
    summary:
      "How builders, trades and suppliers can grow without sacrificing profitability, culture or personal satisfaction. Examines the motivations and risks of growth and provides practical guidance on leadership, organizational structure, financial discipline, systems, technology, staffing, partnerships and performance measurement to help businesses scale intelligently and sustainably.",
  },
  {
    title: "Dynamic Thinking",
    formats: ["keynote", "industry"],
    summary:
      "How home builders can adapt their thinking and business strategies in an environment of continual change. Examines the cognitive biases that inhibit good decision-making, and focuses on the practical areas requiring greater flexibility — overall strategy, technology, construction constraints, inventory, sales and customer selections.",
  },
  {
    title: "The 15 Functions of a Successful Home Building Company",
    formats: ["industry"],
    summary:
      "A comprehensive look at the 15 essential functions that drive a successful home building company. Emphasises how leadership, land, product development, finance, marketing, sales, construction and warranty are interconnected, and how builders can strengthen overall performance by identifying weaknesses, improving coordination, and managing each function effectively.",
  },
];

export type Article = {
  slug: string;
  title: string;
  /** One-sentence standfirst shown under the title and on cards. */
  kicker: string;
  category: string;
  author: string;
  /** "YYYY-MM" or "YYYY-MM-DD". Empty when the source document states no date. */
  date: string;
  cover: string;
  /** Path to the source PDF, or "" for pieces written in the admin editor. */
  pdf: string;
  minutes: number;
  /** Markdown. See app/markdown.tsx for the supported subset. */
  body: string;
};

export const CATEGORIES = [
  "Strategy",
  "Pricing",
  "Sales",
  "Operations",
  "Leadership",
  "Land planning",
  "Product",
] as const;

export function formatArticleDate(date: string): string {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][Number(month) - 1];
  if (!monthName) return year;
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

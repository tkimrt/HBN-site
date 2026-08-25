export type SpeakingEvent = {
  id: number;
  name: string;
  title: string;
  summary: string;
  location: string;
  /** "YYYY-MM-DD" */
  date: string;
  url: string;
  cover: string;
  published: boolean;
};

/**
 * Seeded so the Speaking page and the home page band still have something to
 * show before D1 is provisioned. Anything added through /admin/events takes
 * precedence — a database row with the same name and date replaces this.
 */
export const seedEvents: SpeakingEvent[] = [
  {
    id: -1,
    name: "PCBC San Diego",
    title: "From Market to Move-In: How AI is Changing Homebuilding",
    summary:
      "Co-presented with Michael Bergin of Higharc. A live case study in market intelligence, product selection, marketing, and AI-powered floor plan redesign.",
    location: "San Diego, CA",
    date: "2026-07-15",
    url: "",
    cover: "/images/speaking.jpg",
    published: true,
  },
];

export function formatEventDate(date: string): string {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][Number(month) - 1];
  if (!monthName) return year;
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

/** Short form for the eyebrow above a featured event, e.g. "July 2026". */
export function formatEventMonth(date: string): string {
  if (!date) return "";
  const [year, month] = date.split("-");
  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][Number(month) - 1];
  return monthName ? `${monthName} ${year}` : year;
}

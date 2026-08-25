import type { Article } from "./types";
import getAnAttitude from "./get-an-attitude";
import understandingScale from "./understanding-scale";
import homebuildingIsWarfare from "./homebuilding-is-warfare";
import sellingValueWhenOthersSellPrice from "./selling-value-when-others-sell-price";
import fiveModernThinkers from "./five-modern-thinkers";
import psychologyOfPricing from "./psychology-of-pricing";
import concedingCorrectly from "./conceding-correctly";
import expectedValueAndUtility from "./expected-value-and-utility";
import yourSalespeopleDoWhat from "./your-salespeople-do-what";
import whenTruismsCollide from "./when-truisms-collide";
import binaryProblems from "./binary-problems";
import thoughtsOnLeadership from "./thoughts-on-leadership";

// Ordered newest-first for the index page.
export const staticArticles: Article[] = [
  getAnAttitude,
  understandingScale,
  homebuildingIsWarfare,
  sellingValueWhenOthersSellPrice,
  fiveModernThinkers,
  psychologyOfPricing,
  concedingCorrectly,
  expectedValueAndUtility,
  yourSalespeopleDoWhat,
  whenTruismsCollide,
  binaryProblems,
  thoughtsOnLeadership,
];

export const staticArticleBySlug = new Map(staticArticles.map((a) => [a.slug, a]));

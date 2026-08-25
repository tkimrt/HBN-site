import type { Article } from "./types";

const article: Article = {
  slug: "expected-value-and-utility",
  title: "At the Intersection of Expected Value and Economic Utility Theory",
  kicker: "Expected value says the land deal is good. Marginal utility asks whether you can afford to be wrong.",
  category: "Strategy",
  author: "Al Trellis",
  date: "",
  cover: "/images/art-expected-value.jpg",
  pdf: "/articles/expected-value-and-utility.pdf",
  minutes: 3,
  body: `Anyone concerned with making intelligent business decisions in these uncertain economic times most often relies on analyses whose underlying foundations include risk management and capital allocation. Inherent in these examinations are the concepts of expected value and economic utility. While much has been written about these notions individually, little has been said about them collectively. It is the purpose of this article to explore the relationship between these two ideas specifically as they relate to risk management and mitigation.

The expected value of an event is defined as the product of the probabilities of the possible outcomes of that event and the expected rewards of those outcomes. For example, if we buy a raffle ticket (one of 1000) for a dollar, and there is a single prize of $500, the expected value of the outcome is 999 x $0 plus 1 x $500 divided by 1000 - or 50 cents, ½ of your investment. In this case the expected value is equal to ½ of your investment, even though the probability of losing your entire investment is 99.9%. Note that the expected value has no true significance for a single outcome - it is, rather, the mathematical representation of the value of an infinite number of occurrences.

Now let’s look at an investment in a parcel of land. The price is $1M, and there are three possible outcomes as follows:

1. 30% chance the landfill is constructed adjacent to the property, in which case it will be worth $100,000.

2. 40% chance the landfill will be located on the other side of town, and the parcel will be approved for 20 lots, making it worth $75,000 per paper lot - i.e. $1.5M.

3. 30% chance the landfill will be located on the other side of town, and the parcel will be approved for 50 lots, making it worth $50,000 per paper lot - i.e. $2.5M.

This investment has an expected value of 30% of $100,000 plus 40% of $1.5M plus 30% of $2.5M — i.e. $30,000 plus $600,000 plus $750,000 or $1,380,000. Since the investment required is $1M, expected value analysis says the return on investment will generate a profit of 42.5%.
While this analysis is interesting, and even meaningful, without the use of utility theory we cannot truly understand what is happening and decide whether or not to invest. For in reality we NEVER receive $1,380,000. That number is the weighted average of three separate and distinct outcomes - for our $1M we will receive either $100,000, $1.5M, or $2.5M. And while expected value says this is a good investment, the theory of marginal utility says it is really all about your ability to lose $900,000.

If the $1M required is every dollar you have in the world, then an investment with a 30% chance of reducing your net worth by 90% is probably not a good one. If, however, your net worth is $20M, then the worst outcome still leaves you with $19,100,000 - 95.5% of where you started. This is what marginal utility is all about - that the value of a dollar is relative to the number of dollars from which it comes. To put it simply, the guy with a million dollars really can’t afford the risk side of this investment (he goes from well-off to practically broke) while the guy with $20M starts out rich and ends up rich no matter what the outcome. A simple look at the world tells us that most people really don’t understand utility theory. If they did, the lottery wouldn’t sell ten times as many tickets when the prize is $300M as when it is $30M because the public would realize there is really no difference between going from a net worth of $20,000 to $30M, or going from $20,000 to $300M. In either case, you went from not rich to wildly rich. But the real reason utility theory trumps expected value is not about the upside - every intelligent investment analysis is really about whether you can afford the downside. And that’s why you’d better understand and utilize marginal utility analysis.`,
};

export default article;

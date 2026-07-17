import type { Metadata } from "next";
import { DM_Sans, Libre_Franklin } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const display = Libre_Franklin({ variable: "--font-display", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "hbnnet.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: { default: "Home Builders Network", template: "%s | Home Builders Network" },
    description: "Land planning, home plans, and operator-level consulting that make home builders more profitable.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      type: "website",
      title: "Home Builders Network",
      description: "We make builders more profitable.",
      images: [{ url: new URL("/og.png", baseUrl).toString(), width: 1731, height: 909, alt: "Home Builders Network — We make builders more profitable." }],
    },
    twitter: { card: "summary_large_image", title: "Home Builders Network", description: "We make builders more profitable.", images: [new URL("/og.png", baseUrl).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${display.variable}`}>{children}</body></html>;
}

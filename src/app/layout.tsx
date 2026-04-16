import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com";
const SITE_NAME = "ADU Build LA";

export const viewport: Viewport = {
  themeColor: "#1c1917", // stone-900 — matches the dark header/hero color
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ADU Design & Build Specialists in Los Angeles`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "ADU design and construction specialists in Los Angeles. Custom ADUs starting from $150,000. Design, permitting, and full build services across LA County.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans bg-white text-stone-900">
        {children}
      </body>
    </html>
  );
}

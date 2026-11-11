import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/headers/header"
import Footer from "./components/footers/footer";
import Backdrop from "./components/effects/backdrop";
import EasterJet from "./components/effects/easter-jet";
import BackToTop from "./components/back-to-top";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "./content/contact";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// metadataBase turns relative canonical and Open Graph URLs into full ones. Canonicals are set per page, never here
// (a canonical in the layout would point every page at the home page)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Soham Kar · Apps, websites, digitalisation and automation",
  description:
    "Soham Kar builds apps, websites and software for growing businesses in Raipur and across India: digitalisation, automation and analysis that take you off paper and show you clear numbers.",
  openGraph: {
    title: "Soham Kar · Apps, websites, digitalisation and automation",
    description: "Apps, websites, digitalisation, automation and analysis for growing businesses in Raipur and across India.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soham Kar · Apps, websites, digitalisation and automation",
    description: "Apps, websites, digitalisation, automation and analysis for growing businesses in Raipur and across India.",
  },
};

// Runs before paint: applies the saved theme, or by default the time of day in IST (light 7am-6pm,
// dark otherwise), with no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':(function(){var h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hourCycle:'h23'}).format(new Date());return h<7||h>=18})();if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col relative px-4 sm:px-12 md:px-24 lg:px-48">
        <Backdrop />

        {/* Glass Header */}
        <Header />

        {/* Main content - fallback is below the header area */}
        <main className="flex-auto pt-24 sm:pt-28 md:pt-35">
          {children}
        </main>
        <Footer />
        <EasterJet />
        <BackToTop />
        <Analytics />
      </body>
      {/* Loads only when PUBLIC_GTM_ID is set, so local dev and previews stay untracked */}
      {process.env.PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.PUBLIC_GTM_ID} />}
    </html>
  );
}

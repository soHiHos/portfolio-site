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
import { themeScript } from "./components/effects/ist-theme";
import { OG_IMAGE, SHARE_DESCRIPTION, SITE_DESCRIPTION, SITE_TITLE } from "./content/seo";

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
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: { title: SITE_TITLE, description: SHARE_DESCRIPTION, type: "website", images: OG_IMAGE },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SHARE_DESCRIPTION, images: OG_IMAGE },
};

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
        {/* Runs before paint: the theme for the time of day in IST, or the visitor's unexpired choice, with no flash */}
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

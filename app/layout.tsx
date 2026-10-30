import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/headers/header"
import Footer from "./components/footers/footer";
import Backdrop from "./components/effects/backdrop";
import EasterJet from "./components/effects/easter-jet";
import BackToTop from "./components/back-to-top";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soham Kar — Engineer",
  description:
    "Soham Kar is an engineer in India building at the intersection of AI, software, hardware, and environmental engineering.",
  openGraph: {
    title: "Soham Kar — Engineer",
    description: "Building at the intersection of AI, software, hardware, and sustainability.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soham Kar — Engineer",
    description: "Building at the intersection of AI, software, hardware, and sustainability.",
  },
};

// Runs before paint: applies the saved theme, or by default the time of day in IST (light 7am-6pm,
// dark otherwise), with no flash, and marks JS as available
// so scroll-reveal styles only hide content when they can also reveal it.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':(function(){var h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hourCycle:'h23'}).format(new Date());return h<7||h>=18})();if(d)document.documentElement.classList.add('dark')}catch(e){}document.documentElement.classList.add('js')})()`;

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
      </body>
    </html>
  );
}

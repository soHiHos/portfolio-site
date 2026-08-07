import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/headers/header"
import Footer from "./components/footers/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My Portfolio - Work, About & Contact",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-screen flex flex-col relative bg-center bg-cover bg-fixed bg-repeat px-4 sm:px-12 md:px-24 lg:px-48">
        {/* Glass Header */}
        <Header />
        
        {/* Main content - fallback is below the header area */}
        <main className="flex-auto pt-24 sm:pt-28 md:pt-35">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

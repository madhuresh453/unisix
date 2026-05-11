import "@/styles/globals.css";

import {
  Inter,
  Poppins,
  Teko,
} from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Providers } from "@/context/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "400",
    "600",
    "700",
    "800",
    "900",
  ],
  variable: "--font-poppins",
  display: "swap",
});

const teko = Teko({
  subsets: ["latin"],
  weight: [
    "500",
    "600",
    "700",
  ],
  variable: "--font-teko",
  display: "swap",
});

export const metadata = {
  title: "UNI6CTF | Hack. Learn. Compete. Grow.",

  description:
    "A production-ready cybersecurity CTF platform for events, challenges, scoreboards, writeups, and hacker community operations.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${teko.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#050505] text-white antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            {/* NAVBAR */}
            <Navbar />

            {/* PAGE CONTENT */}
            <main className="flex-1">
              {children}
            </main>

            {/* FOOTER */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
import Image from "next/image";
import Link from "next/link";

import {
  Github,
  Linkedin,
  MessageCircle,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505]/95 shadow-[0_-18px_60px_rgba(0,0,0,0.35)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <Image
                src="/images/UNI6CTF -final logo.png"
                alt="UNI6CTF Logo"
                width={90}
                height={90}
                priority
                className="h-[90px] w-[90px] rounded-full object-cover"
              />

              <span className="font-display text-[30px] font-black uppercase leading-none tracking-[0.02em] text-white">
                UNI6
                <span className="text-cyber-red">
                  CTF
                </span>
              </span>
            </Link>

            <p className="mt-6 w-full text-[14px] leading-6 text-[#9ca3af]">
              Empowering hackers. Building
              community. Securing the future.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-7 flex gap-5 text-white/80">
              <Link
                href="/contact"
                aria-label="Community"
                className="transition-all duration-300 hover:text-cyber-red hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                aria-label="Twitter"
                className="transition-all duration-300 hover:text-cyber-red hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                <Twitter className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                aria-label="GitHub"
                className="transition-all duration-300 hover:text-cyber-red hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                <Github className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                aria-label="LinkedIn"
                className="transition-all duration-300 hover:text-cyber-red hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                <Linkedin className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                aria-label="YouTube"
                className="transition-all duration-300 hover:text-cyber-red hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
              Quick Links
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-[#9ca3af] [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-cyber-red">
              <Link href="/">Home</Link>

              <Link href="/about">
                About Us
              </Link>

              <Link href="/ctf">
                CTF Events
              </Link>

              <Link href="/leaderboard">
                Leaderboard
              </Link>

              <Link href="/writeups">
                Writeups
              </Link>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
              Resources
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-[#9ca3af] [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-cyber-red">
              <Link href="/writeups">
                Blog
              </Link>

              <Link href="/challenge/shadow-login">
                Practice Arena
              </Link>

              <Link href="/leaderboard">
                Hall of Fame
              </Link>

              <Link href="/about">
                FAQ
              </Link>

              <Link href="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
              Stay Updated
            </h3>

            <p className="mt-4 w-full text-sm leading-6 text-[#9ca3af]">
              Subscribe to our newsletter
              for latest updates and events.
            </p>

            <form className="cyber-glass mt-6 flex w-full overflow-hidden rounded-md border border-white/[0.08]">
              <input
                type="email"
                className="min-h-12 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#9ca3af]/70"
                placeholder="Enter your email"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="grid w-14 place-items-center bg-cyber-red text-white shadow-glow transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-white/[0.08] pt-5 text-center text-sm text-[#9ca3af]/70">
          <p>
            © 2026 UNI6CTF. All rights
            reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-cyber-red"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-cyber-red"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
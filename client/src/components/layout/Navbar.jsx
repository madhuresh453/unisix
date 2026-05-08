"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/utils/constants";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050505] shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
      <div className="flex h-[72px] w-full items-center justify-between gap-5 px-6 lg:h-[88px]">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          {/* <Image
                                      src="/images/UNI6CTF -final logo.png"
                                      alt="UNI6CTF Logo"
                                      width={90}
                                      height={90}
                                      className="
                            h-[90px]
                            w-[90px]
                            rounded-full
                            object-cover
                           
                          "
                                    /> */}
          <span className="font-display text-[23px] font-black uppercase leading-none tracking-[0.02em] text-white sm:text-[28px]">
            UNI6<span className="text-cyber-red">CTF</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative inline-flex h-[88px] items-center gap-1.5 whitespace-nowrap text-[12px] font-black uppercase tracking-[0.08em] transition-all duration-300 ease-out",
                pathname === link.href ? "text-cyber-red" : "text-white hover:text-cyber-red"
              )}
            >
              {link.label}
              {link.label === "CTF" ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              <span className={cn(
                "absolute bottom-0 left-0 h-[2px] bg-cyber-red shadow-glow transition-all duration-300",
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Button href="/auth/login" variant="secondary" className="min-h-[42px] whitespace-nowrap rounded-md border-white/[0.28] bg-white/[0.02] px-6 py-2.5 text-[12px]">
            Login
          </Button>
          <Button href="/auth/register" className="min-h-[42px] whitespace-nowrap rounded-md px-6 py-2.5 text-[12px]">
            Sign Up
          </Button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300 hover:border-cyber-red/60 hover:shadow-glow-card xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-[#050505]/98 px-6 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl xl:hidden">
          <div className="grid w-full gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02] hover:text-cyber-red"
              >
                {link.label}
                {link.label === "CTF" ? <ChevronDown className="h-4 w-4" /> : null}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Button href="/auth/login" variant="secondary">
                Login
              </Button>
              <Button href="/auth/register">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

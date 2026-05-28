"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getLockState,
  getMainNavigation,
  getProfileNavigation,
  isAdminUser,
  isNavItemActive
} from "@/config/navigationConfig";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const mainNav = getMainNavigation({ user, isAuthenticated });
  const profileNav = getProfileNavigation({ user, isAuthenticated });
  const isAdmin = isAdminUser(user);

  // CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setOpen(false);
    setAcademyOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // LOCK BODY SCROLL WHEN MENU OPEN
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[999] border-b border-white/[0.08] bg-[#050505]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.65)]">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:h-[88px] lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="group relative z-50 flex shrink-0 items-center gap-3"
        >
          <span className="font-display text-[24px] font-black uppercase leading-none tracking-[0.02em] text-white sm:text-[30px]">
            UNI6
            <span className="text-cyber-red transition-all duration-300 group-hover:text-red-500">
              CTF
            </span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-7 xl:flex">
          {mainNav.map((link) => {
            if (link.group) {
              const groupActive = link.items.some((item) => isNavItemActive(pathname, item.href));
              return (
                <div key={link.label} className="group relative inline-flex h-[88px] items-center">
                  <button
                    type="button"
                    className={cn(
                      "group relative inline-flex h-[88px] items-center gap-1.5 whitespace-nowrap text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 ease-out",
                      groupActive ? "text-cyber-red" : "text-white hover:text-cyber-red"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                    </span>
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-[2px] bg-cyber-red shadow-[0_0_18px_rgba(255,0,60,0.7)] transition-all duration-300",
                        groupActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </button>
                  <div className="pointer-events-none absolute left-1/2 top-[84px] z-50 min-w-[220px] -translate-x-1/2 rounded-xl border border-white/[0.08] bg-[#050505]/98 p-2 opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                    {link.items.map((item) => {
                      const active = isNavItemActive(pathname, item.href);
                      const lockState = getLockState(item, user);
                      return (
                        <Link
                          key={`${link.label}-${item.href}`}
                          href={item.href}
                          className={cn(
                            "mb-1 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.11em] transition-all duration-300",
                            active ? "bg-cyber-red/15 text-cyber-red" : "text-white hover:bg-white/[0.04] hover:text-cyber-red"
                          )}
                        >
                          <span>{item.label}</span>
                          {lockState.locked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.08em] text-cyber-red/90">
                              <Lock className="h-3.5 w-3.5 text-cyber-red/80" />
                              Upgrade
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            const isActive = isNavItemActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative inline-flex h-[88px] items-center gap-1.5 whitespace-nowrap text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 ease-out",
                  isActive
                    ? "text-cyber-red"
                    : "text-white hover:text-cyber-red"
                )}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {link.label}
                </span>

                {/* UNDERLINE */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-cyber-red shadow-[0_0_18px_rgba(255,0,60,0.7)] transition-all duration-300",
                    isActive
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {!loading && !isAuthenticated ? (
            <>
              <Button
                href="/auth/login"
                variant="secondary"
                className="min-h-[44px] whitespace-nowrap rounded-xl border border-white/[0.18] bg-white/[0.02] px-7 py-2.5 text-[12px] font-black uppercase tracking-[0.14em] transition-all duration-300 hover:border-cyber-red/60 hover:bg-[#12070a]"
              >
                Login
              </Button>

              <Button
                href="/auth/register"
                className="min-h-[44px] whitespace-nowrap rounded-xl bg-cyber-red px-7 py-2.5 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_0_30px_rgba(255,0,60,0.35)] transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_40px_rgba(255,0,60,0.5)]"
              >
                Sign Up
              </Button>
            </>
          ) : null}
          {!loading && isAuthenticated ? (
            <>
              {isAdmin ? (
                <Button href="/admin/dashboard" variant="secondary" className="min-h-[44px] whitespace-nowrap rounded-xl px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.14em]">
                  Admin Panel
                </Button>
              ) : null}
              <div className="relative">
                <Button onClick={() => setProfileOpen((prev) => !prev)} variant="secondary" className="min-h-[44px] whitespace-nowrap rounded-xl px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.14em]">
                  {user?.handle || user?.name || "Profile"}
                </Button>
                {profileOpen ? (
                  <div className="absolute right-0 top-[54px] z-50 min-w-[220px] rounded-xl border border-white/[0.08] bg-[#050505]/98 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                    {profileNav.map((item) => (
                      <Link key={item.href} href={item.href} className="mb-1 block rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.11em] text-white transition-all duration-300 hover:bg-white/[0.04] hover:text-cyber-red">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              <Button onClick={signOut} className="min-h-[44px] whitespace-nowrap rounded-xl bg-cyber-red px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.14em] text-white">
                Logout
              </Button>
            </>
          ) : null}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Navigation"
          aria-expanded={open}
          className="relative z-50 grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white transition-all duration-300 hover:border-cyber-red/60 hover:bg-[#12070a] hover:shadow-[0_0_18px_rgba(255,0,60,0.25)] xl:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cn(
          "overflow-hidden border-t border-white/[0.08] bg-[#050505]/98 backdrop-blur-xl transition-all duration-300 xl:hidden",
          open
            ? "max-h-[900px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-2 px-4 py-5">
          {mainNav.map((link) => {
            if (link.group) {
              const groupActive = link.items.some((item) => isNavItemActive(pathname, item.href));
              return (
                <div key={link.label} className="overflow-hidden rounded-xl border border-transparent">
                  <button
                    type="button"
                    onClick={() => setAcademyOpen((prev) => !prev)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition-all duration-300",
                      groupActive
                        ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                        : "border-transparent text-white hover:border-white/[0.08] hover:bg-white/[0.02] hover:text-cyber-red"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", academyOpen ? "rotate-180" : "")} />
                  </button>
                  {academyOpen ? (
                    <div className="mt-1 space-y-1 px-2">
                      {link.items.map((item) => {
                        const lockState = getLockState(item, user);
                        return (
                          <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.11em] text-white/90 transition-all duration-300 hover:bg-white/[0.04] hover:text-cyber-red">
                            <span>{item.label}</span>
                            {lockState.locked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.08em] text-cyber-red/90">
                                <Lock className="h-3.5 w-3.5 text-cyber-red/80" />
                                Upgrade
                              </span>
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }
            const isActive = isNavItemActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-black uppercase tracking-[0.12em] transition-all duration-300",
                  isActive
                    ? "border-cyber-red/30 bg-cyber-red/10 text-cyber-red"
                    : "border-transparent text-white hover:border-white/[0.08] hover:bg-white/[0.02] hover:text-cyber-red"
                )}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* MOBILE BUTTONS */}
          <div className="grid gap-2 pt-3 sm:grid-cols-2">
            {!loading && !isAuthenticated ? (
              <>
                <Button
                  href="/auth/login"
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </Button>

                <Button
                  href="/auth/register"
                  className="w-full"
                >
                  Sign Up
                </Button>
              </>
            ) : null}
            {!loading && isAuthenticated ? (
              <>
                <Button href="/dashboard" variant="secondary" className="w-full">
                  {user?.handle || user?.name || "Profile"}
                </Button>
                {profileNav.filter((item) => item.href !== "/dashboard").map((item) => (
                  <Button key={item.href} href={item.href} variant="secondary" className="w-full">
                    {item.label}
                  </Button>
                ))}
                <Button onClick={signOut} className="w-full">
                  Logout
                </Button>
                {isAdmin ? (
                  <Button href="/admin/dashboard" variant="secondary" className="w-full sm:col-span-2">
                    Admin Panel
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

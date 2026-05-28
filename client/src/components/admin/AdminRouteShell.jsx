"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/helpers";
import { getAdminNavigation, isNavItemActive } from "@/config/navigationConfig";

export function AdminRouteShell({ title, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const navItems = getAdminNavigation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading || !isAuthenticated) {
    return <main className="mx-auto max-w-7xl px-6 py-10 text-white">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-white">
      <h1 className="text-3xl font-black uppercase">{title}</h1>
      <nav className="mt-4 flex flex-wrap gap-2">
        {navItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.1em] transition-all duration-300",
                active
                  ? "border-cyber-red/40 bg-cyber-red/10 text-cyber-red"
                  : "border-white/10 text-white hover:border-cyber-red/40 hover:text-cyber-red"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">{children}</div>
    </main>
  );
}

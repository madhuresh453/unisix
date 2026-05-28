"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/utils/helpers";
import { getDashboardNavigation, isNavItemActive } from "@/config/navigationConfig";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = getDashboardNavigation({ user });

  return (
    <aside className="cyber-panel h-fit rounded-xl p-3 lg:sticky lg:top-24">
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isNavItemActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[0.12em] transition",
                active ? "bg-cyber-red text-white shadow-glow" : "text-cyber-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
              {link.locked ? <Lock className="ml-auto h-3.5 w-3.5 text-cyber-red/80" /> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Award,
  BadgeCheck,
  CircuitBoard,
  Flag,
  LayoutDashboard,
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/utils/helpers";

const links = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activity", href: "/dashboard/activity", icon: Activity },
  { label: "Submissions", href: "/dashboard/submissions", icon: Flag },
  { label: "Challenges", href: "/dashboard/challenges", icon: CircuitBoard },
  { label: "Hints", href: "/dashboard/hints", icon: BadgeCheck },
  { label: "Badges", href: "/dashboard/badges", icon: Award },
  { label: "Teams", href: "/dashboard/teams", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="cyber-panel h-fit rounded-xl p-3 lg:sticky lg:top-24">
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import Link from "next/link";
import { cn } from "@/utils/helpers";

export function Tabs({ tabs, active }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] transition",
            active === tab.value
              ? "bg-cyber-red text-white shadow-glow"
              : "text-cyber-muted hover:bg-white/5 hover:text-white"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

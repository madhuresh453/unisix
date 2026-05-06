import { cn } from "@/utils/helpers";

export function Badge({ children, tone = "red", className = "" }) {
  const tones = {
    red: "border-cyber-red/35 bg-cyber-red/10 text-white",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    zinc: "border-white/15 bg-white/5 text-cyber-muted",
    amber: "border-amber-300/30 bg-amber-300/10 text-amber-100"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

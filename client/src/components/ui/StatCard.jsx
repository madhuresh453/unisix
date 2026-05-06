import { ArrowUpRight } from "lucide-react";
import { Card } from "./Card";

export function StatCard({ label, value, detail, delta }) {
  return (
    <Card glow className="relative overflow-hidden">
      <div className="absolute right-4 top-4 text-cyber-red/50">
        <ArrowUpRight className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyber-muted">{label}</p>
      <p className="mt-4 font-display text-4xl font-black uppercase">{value}</p>
      <p className="mt-3 text-sm text-cyber-muted">{detail || delta}</p>
    </Card>
  );
}

import { ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function JoinTeamCTA() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080808]/95 px-6 py-8 shadow-[0_0_40px_rgba(255,0,0,0.08)] sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,55,0.16),transparent_32%)]" />
      <div className="absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,rgba(255,0,55,0.28),transparent)]" />
      <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyber-red/25 bg-cyber-red/10 text-cyber-red shadow-[inset_0_0_24px_rgba(255,0,0,0.12)]">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyber-red">Join the command</p>
          <h2 className="mt-4 font-teko text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white">Want to join our team?</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-cyber-muted">
            We’re building the next generation of cyber operations, research, and event engineering. Apply now and help shape the future of UNI6CTF.
          </p>
        </div>
        <Button href="/careers" className="self-start lg:self-center" icon={ArrowRight} iconPosition="right">
          Open Positions
        </Button>
      </div>
    </section>
  );
}

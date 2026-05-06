import { ArrowRight, Handshake, Sparkles, Globe2, UserPlus, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  { label: "Global Exposure", icon: Globe2 },
  { label: "Community Impact", icon: Sparkles },
  { label: "Talent Connect", icon: UserPlus },
  { label: "Brand Visibility", icon: Target }
];

export function BecomeSponsorCTA() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#080808]/95 px-6 py-8 shadow-[0_0_40px_rgba(255,0,0,0.08)] sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,55,0.14),transparent_32%)]" />
      <div className="absolute right-0 top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,0,55,0.12),transparent_48%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyber-red">BECOME A SPONSOR</p>
          <h2 className="mt-4 font-teko text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
            LET’S BUILD A SECURE FUTURE TOGETHER
          </h2>
          <p className="mt-5 text-sm leading-7 text-cyber-muted">
            Partner with UNI6CTF to amplify your brand, reach elite talent, and support community-driven cyber defense initiatives.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-[#050505]/70 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-black/40 text-cyber-red shadow-[0_0_24px_rgba(255,0,0,0.12)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-white">{feature.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-[32px] border border-white/10 bg-[#0b0b0b]/90 p-8 text-center shadow-glow">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyber-red/25 bg-black/40 text-cyber-red shadow-[inset_0_0_28px_rgba(255,0,0,0.14)]">
            <Handshake className="h-12 w-12" />
          </div>
          <div className="mt-8 text-base leading-7 text-cyber-muted">
            A dedicated sponsor experience built to elevate your presence across every UNI6CTF competition and industry activation.
          </div>
          <Button href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-cyber-red px-6 py-3 text-sm font-black uppercase tracking-[0.18em] shadow-glow hover:bg-red-500">
            Become A Sponsor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

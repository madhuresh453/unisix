import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

const testimonials = [
  {
    quote: "UNI6CTF delivered exceptional brand exposure and a world-class audience of security professionals. Our sponsorship helped us recruit top talent and build credibility in cyber communities.",
    name: "Ava Lawson",
    role: "Global Partnerships Lead",
    company: "Palo Alto Networks"
  },
  {
    quote: "The event execution and partner support were flawless. We saw measurable engagement from developers, researchers, and enterprise buyers.",
    name: "Rohan Patel",
    role: "Head of Strategic Alliances",
    company: "Google Cloud"
  },
  {
    quote: "UNI6CTF understands the security audience. Sponsoring the platform helped us connect with the right people and amplify our product story.",
    name: "Sofia Cheng",
    role: "Marketing Director",
    company: "CrowdStrike"
  }
];

export function SponsorTestimonials() {
  return (
    <section className="grid gap-6 rounded-[32px] border border-white/10 bg-[#0a0a0a]/95 p-6 shadow-[0_0_40px_rgba(255,0,0,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyber-red">WHAT OUR PARTNERS SAY</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-cyber-muted">Feedback from leading brands and security organizations that trust UNI6CTF sponsorships.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white transition hover:border-cyber-red/45 hover:shadow-glow">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white transition hover:border-cyber-red/45 hover:shadow-glow">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <div key={item.name} className="group rounded-[28px] border border-white/10 bg-[#050505]/95 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyber-red/40 hover:shadow-glow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-black/40 text-cyber-red shadow-[0_0_24px_rgba(255,0,0,0.12)]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="mt-5 text-sm leading-7 text-[#f8fafbcc]">"{item.quote}"</p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-black uppercase tracking-[0.18em] text-white">{item.name}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cyber-red">{item.role}</p>
              <p className="mt-1 text-sm text-cyber-muted">{item.company}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot === 0 ? "bg-cyber-red" : "bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}

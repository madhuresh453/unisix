import { Globe2, Users, Sparkles, ShieldCheck } from "lucide-react";

const benefits = [
  { title: "Global Reach", icon: Globe2, body: "Connect with a worldwide audience of cyber practitioners, students, and enterprise leaders." },
  { title: "Talent Pipeline", icon: Users, body: "Tap into a curated community of security engineers, researchers, and competitive hackers." },
  { title: "Brand Visibility", icon: Sparkles, body: "Elevate your reputation across event activations, challenges, and community programs." },
  { title: "Make An Impact", icon: ShieldCheck, body: "Support real-world security education and reward next-generation defense skillsets." }
];

export function PartnerBenefits() {
  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyber-red">WHY PARTNER WITH UNI6CTF?</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-cyber-muted">We bring measurable value through audience engagement, talent discovery, brand prestige, and community trust.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyber-red/40 hover:shadow-glow-card">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-black/50 text-cyber-red shadow-[0_0_24px_rgba(255,0,0,0.12)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-black uppercase tracking-[-0.02em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-cyber-muted">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

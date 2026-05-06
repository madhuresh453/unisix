import Link from "next/link";

const footerLinks = [
  { title: "Quick Links", links: ["About", "Events", "Team", "Contact"] },
  { title: "Resources", links: ["Blog", "Docs", "Careers", "Support"] },
  { title: "Community", links: ["Discord", "GitHub", "Twitter", "Newsletter"] }
];

export function TeamFooter() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#070707]/95 p-6 shadow-[0_0_40px_rgba(255,0,0,0.08)] sm:p-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 font-display text-[28px] font-black uppercase tracking-[0.02em] text-white">
            <span>UNI6</span>
            <span className="text-cyber-red">CTF</span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-cyber-muted">
            A premium cyber warfare organization and security operations collective for elite events, challenges, and research teams.
          </p>
          <div className="flex items-center gap-4 text-white/80">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">IG</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">GH</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">DC</span>
          </div>
        </div>

        {footerLinks.map((item) => (
          <div key={item.title} className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyber-red">{item.title}</p>
            <div className="grid gap-3 text-sm text-cyber-muted">
              {item.links.map((link) => (
                <Link
                  key={link}
                  href="/"
                  className="transition hover:text-white hover:translate-x-0.5"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-[28px] border border-white/10 bg-[#090909]/80 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyber-red">Newsletter</p>
          <p className="mt-4 text-sm leading-7 text-cyber-muted">Stay updated on mission briefings, research launches, and invite-only community events.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none placeholder:text-cyber-muted focus:border-cyber-red/70 focus:bg-black/70 focus:shadow-glow"
            />
            <button className="min-h-12 rounded-2xl bg-cyber-red px-6 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-glow transition hover:bg-red-500">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-cyber-muted">
        © 2026 UNI6CTF. All rights reserved.
      </div>
    </section>
  );
}

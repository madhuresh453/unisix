import Link from "next/link";

const footerColumns = [
  { title: "Quick Links", links: ["Home", "About Us", "CTF Events", "Leaderboard", "Sponsors", "Contact"] },
  { title: "Resources", links: ["Blog", "Docs", "FAQ", "Privacy Policy"] },
  { title: "Community", links: ["Discord", "Twitter", "GitHub", "YouTube"] }
];

export function SponsorFooter() {
  return (
    <section className="grid gap-10 rounded-[32px] border border-white/10 bg-[#080808]/95 p-6 shadow-[0_0_40px_rgba(255,0,0,0.08)] sm:p-8">
      <div className="grid gap-10 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3 font-display text-[28px] font-black uppercase tracking-[0.02em] text-white">
            <span>UNI6</span>
            <span className="text-cyber-red">CTF</span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-cyber-muted">
            Empowering elite cybersecurity communities through premium events, research, and partner programs.
          </p>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">DC</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">TW</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">GH</span>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyber-red">{column.title}</p>
            <div className="grid gap-3 text-sm text-cyber-muted">
              {column.links.map((link) => (
                <Link key={link} href="/" className="transition hover:text-white">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-[28px] border border-white/10 bg-[#090909]/80 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyber-red">Newsletter</p>
          <p className="mt-4 text-sm leading-7 text-cyber-muted">Subscribe to get the latest sponsor briefings, event updates, and community announcements.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/50 px-4 text-sm text-white outline-none placeholder:text-cyber-muted focus:border-cyber-red/70 focus:bg-black/70 focus:shadow-glow"
            />
            <button className="min-h-12 rounded-2xl bg-cyber-red px-6 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-glow transition hover:bg-red-500">
              Submit
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

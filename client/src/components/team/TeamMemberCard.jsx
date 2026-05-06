import { Github, Globe, Linkedin, MessageCircle } from "lucide-react";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  discord: MessageCircle,
  website: Globe
};

export function TeamMemberCard({ name, title, description, badge, socials = [] }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="group relative min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-cyber-red/40 hover:shadow-glow-card">
      {badge ? (
        <span className="absolute right-6 top-6 inline-flex items-center rounded-full border border-cyber-red/25 bg-cyber-red/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.26em] text-cyber-red">
          {badge}
        </span>
      ) : null}

      <div className="relative mx-auto mb-6 h-28 w-28 rounded-full border border-cyber-red/25 bg-[#050505]/90 p-1 shadow-[0_0_28px_rgba(255,0,0,0.12)]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,0,55,0.18),transparent_45%)]" />
        <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#020202] text-3xl font-black uppercase tracking-[0.08em] text-white">
          {initials}
        </div>
      </div>

      <h3 className="text-xl font-black uppercase tracking-[-0.02em] text-white">{name}</h3>
      <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-cyber-red">{title}</p>
      <p className="mt-4 px-1 text-sm leading-7 text-[#e5e7ebcc]">{description}</p>

      <div className="mt-8 flex justify-center gap-3">
        {socials.map((item) => {
          const Icon = socialIcons[item.type];
          return (
            <a
              key={item.type}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/50 text-cyber-muted transition duration-300 hover:border-cyber-red/45 hover:bg-cyber-red/10 hover:text-white hover:shadow-glow"
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
    </article>
  );
}

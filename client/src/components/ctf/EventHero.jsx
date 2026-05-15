import { Calendar, Clock3, Trophy, Users } from "lucide-react";

export function EventHero({ title, description, date, duration, participants, winners = [] }) {
  return (
    <section className="cyber-panel rounded-[28px] border border-white/10 p-6 md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyber-red">Event Archive</p>
      <h2 className="mt-3 font-teko text-4xl uppercase leading-[0.95] tracking-[0.01em] text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-cyber-muted md:text-base">{description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#080808]/95 p-4">
          <Calendar className="h-4 w-4 text-cyber-red" />
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cyber-muted">Date</p>
          <p className="mt-1 text-sm font-bold">{date || "Not specified"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#080808]/95 p-4">
          <Clock3 className="h-4 w-4 text-cyber-red" />
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cyber-muted">Duration</p>
          <p className="mt-1 text-sm font-bold">{duration || "Unknown"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#080808]/95 p-4">
          <Users className="h-4 w-4 text-cyber-red" />
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cyber-muted">Participants</p>
          <p className="mt-1 text-sm font-bold tabular-nums">{participants || 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#080808]/95 p-4">
          <Trophy className="h-4 w-4 text-cyber-red" />
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cyber-muted">Winners</p>
          <p className="mt-1 line-clamp-2 text-sm font-bold">{winners.length ? winners.join(", ") : "Not available"}</p>
        </div>
      </div>
    </section>
  );
}

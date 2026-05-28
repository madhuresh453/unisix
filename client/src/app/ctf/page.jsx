import Link from "next/link";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock3,
  Radio,
  Users,
} from "lucide-react";

import { fetchCms } from "@/lib/cmsApi";
import { mapCtfToCard } from "@/lib/ctfMapper";
import { CountdownTimer } from "@/components/CountdownTimer";

const scoreboard = [
  { rank: 1, team: "xxxx", score: 1 },
  { rank: 2, team: "xxxx", score: 2 },
  { rank: 3, team: "xxxx", score: 3 },
  { rank: 4, team: "xxxx", score: 4 },
  { rank: 5, team: "xxxx", score: 5 },
  { rank: 6, team: "xxxx", score: 6 },
  { rank: 7, team: "xxxx", score: 7 },
  { rank: 8, team: "xxxx", score: 8 },
  { rank: 9, team: "xxxx", score: 9 },
  { rank: 10, team: "xxxx", score: 10 },
];

export default async function CTFPage() {
  const ctfRes = await fetchCms("/ctfs?limit=200");
  const events = (ctfRes?.ctfs || []).map(mapCtfToCard);
  const liveEvent = events.find((event) => event.status === "live") || events[0] || mapCtfToCard({});
  const upcomingEvents = events.filter((event) => event.status === "upcoming").slice(0, 3);
  const pastRows = events
    .filter((event) => event.status === "past")
    .slice(0, 8)
    .map((event) => ({
      id: event.id,
      slug: event.slug,
      event: event.name,
      duration: event.duration,
      participants: event.participants ? String(event.participants) : "0",
      winners: event.winners?.[0] || "-",
      date: new Date(event.startsAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
    }));

  return (
    <main className="bg-[#050505] text-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.75) 100%), radial-gradient(circle at left, rgba(255,0,55,0.18), transparent 45%), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1900&q=80')",
          }}
        />

        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,31,69,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,31,69,0.16)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
          <p className="text-sm text-white/70">
            Home <span className="mx-2">&gt;</span> CTF
          </p>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff1f45]">
            Cyber Competition Network
          </p>

          <h1 className="mt-3 font-teko text-[88px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_28px_rgba(255,0,60,0.5)] md:text-[108px]">
            CTF
          </h1>

          <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/80">
            Compete. Learn. Secure the future. Join our Capture The Flag
            events and challenge your skills with hackers around the world.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,8,8,0.95)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* NAVIGATION */}
          <div className="grid grid-cols-1 text-center text-lg font-semibold uppercase tracking-[0.06em] md:grid-cols-3">
            <Link
              href="/ctf/live"
              className="group relative flex items-center justify-center gap-3 border-r border-white/10 bg-black/50 py-5 text-[#ff1f45] transition-all duration-300"
            >
              <Radio className="h-5 w-5" />
              Registration Open

              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff003c] shadow-[0_0_18px_rgba(255,0,60,0.8)]" />
            </Link>

            <Link
              href="/ctf/upcoming"
              className="group flex items-center justify-center gap-3 border-r border-white/10 py-5 text-white/70 transition-all duration-300 hover:bg-[#14080b] hover:text-white"
            >
              <Calendar className="h-5 w-5" />
              Upcoming CTF
            </Link>

            <Link
              href="/ctf/past"
              className="group flex items-center justify-center gap-3 py-5 text-white/70 transition-all duration-300 hover:bg-[#14080b] hover:text-white"
            >
              <Clock3 className="h-5 w-5" />
              Past CTF
            </Link>
          </div>

          <div className="space-y-10 border-t border-white/10 p-6 md:p-8">
            {/* LIVE SECTION */}
            <div>
              <div className="mb-5 flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff003c]" />
                Registration Open
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                {/* LIVE CARD */}
                <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080808] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/50 hover:shadow-[0_0_35px_rgba(255,0,60,0.2)]">
                  <div className="grid md:grid-cols-[0.95fr_1.25fr]">
                    <div className="relative min-h-[290px] overflow-hidden">
                      <img
                        src="images/ctfpage.jpg"
                        alt="Live CTF"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-[#18040a]/30 to-transparent" />
                    </div>

                    <div className="p-6 md:p-8">
                      <span className="inline-flex rounded-md bg-[#0e2f17] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6dff91]">
                        Registration Open
                      </span>

                      <h2 className="mt-3 font-teko text-6xl uppercase leading-[0.85] tracking-[0.01em] text-white">
                        CTF 4 CYBER CHALLENGE
                      </h2>

                      <p className="mt-3 text-white/75">Hasan Kalyoncu University, TURKEY</p>

                      <div className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#ff1f45]" />
                          15 MAY
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-[#ff1f45]" />
                          24 HOURS
                        </span>

                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#ff1f45]" />
                          150+ Teams
                        </span>
                      </div>

                      <div className="mt-8">
                        <CountdownTimer
                          startDate={liveEvent.startsAt}
                          endDate={liveEvent.endsAt}
                          status={liveEvent.status}
                        />
                      </div>

                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                          href={`/ctf/${liveEvent.slug || liveEvent.id}`}
                          className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]"
                        >
                          Join CTF
                          <ChevronRight className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/ctf/${liveEvent.slug || liveEvent.id}`}
                          className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#18090d]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

                {/* SCOREBOARD */}
                <aside className="rounded-2xl border border-white/10 bg-[#080808] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold uppercase tracking-[0.08em]">
                      Live Scoreboard
                    </h3>

                    <Link
                      href="/leaderboard"
                      className="text-sm font-semibold uppercase tracking-[0.08em] text-[#ff1f45]"
                    >
                      View Full
                    </Link>
                  </div>

                  <div className="mt-6 space-y-1">
                    <div className="grid grid-cols-[56px_1fr_90px] border-b border-white/10 pb-3 text-xs uppercase tracking-[0.12em] text-white/45">
                      <span>Rank</span>
                      <span>Team</span>
                      <span className="text-right">Score</span>
                    </div>

                    {scoreboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className="grid grid-cols-[56px_1fr_90px] items-center border-b border-white/10 py-3 text-sm text-white/85"
                      >
                        <span className="font-bold text-[#ff1f45]">
                          {entry.rank}
                        </span>

                        <span>{entry.team}</span>

                        <span className="text-right">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>

            {/* UPCOMING SECTION */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffd61f]" />
                  Upcoming CTF
                </div>

                <Link
                  href="/ctf/upcoming"
                  className="text-sm font-semibold uppercase tracking-[0.08em] text-[#ffd61f]"
                >
                  View All Upcoming
                </Link>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <article
                    key={event.id}
                    className="group rounded-xl border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/60 hover:shadow-[0_0_22px_rgba(255,0,60,0.22)]"
                  >
                    <span className="inline-flex rounded-md bg-[#312806] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#ffd61f]">
                      {event.registrationOpen ? "Registration Open" : "Upcoming"}
                    </span>

                    <div className="mt-4 flex gap-4">
                      <div className="grid h-20 w-16 place-content-center rounded-lg border border-white/20 bg-black/60 text-center">
                        <span className="text-xs font-bold uppercase text-[#ff1f45]">
                          {new Date(event.startsAt).toLocaleDateString("en", { month: "short" }).toUpperCase()}
                        </span>

                        <span className="font-teko text-4xl leading-none">
                          {new Date(event.startsAt).getDate()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-teko text-[42px] uppercase leading-[0.85]">
                          {event.name}
                        </h3>

                        <p className="mt-2 text-sm text-white/70">
                          {event.description.slice(0, 90)}...
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-4 w-4 text-[#ff1f45]" />
                        {event.duration}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-[#ff1f45]" />
                        {event.players || event.teams}
                      </span>

                      <span className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-[#ff1f45]" />
                        {event.difficulty}
                      </span>
                    </div>

                    <div className="mt-5">
                      <CountdownTimer
                        startDate={event.startsAt}
                        endDate={event.endsAt}
                        status={event.status}
                      />
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/ctf/${event.slug || event.id}`}
                        className="inline-flex items-center gap-2 rounded-md bg-[#ffcf00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:brightness-105"
                      >
                        Register Now
                        <ChevronRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/ctf/${event.slug || event.id}`}
                        className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* PAST EVENTS */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
                  Past CTF
                </div>

                <Link
                  href="/ctf/past"
                  className="text-sm font-semibold uppercase tracking-[0.08em] text-white/70"
                >
                  View All Past Events
                </Link>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#0b0b0b] text-xs uppercase tracking-[0.12em] text-white/50">
                      <th className="px-5 py-3">Event</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Participants</th>
                      <th className="px-5 py-3">Winners</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pastRows.map((row) => (
                      <tr
                        key={row.event}
                        className="border-t border-white/10 bg-[#080808] text-sm transition-colors duration-300 hover:bg-[#12090c]"
                      >
                        <td className="px-5 py-4 font-medium">
                          {row.event}
                        </td>

                        <td className="px-5 py-4 text-white/70">
                          {row.date}
                        </td>

                        <td className="px-5 py-4 text-white/70">
                          {row.duration}
                        </td>

                        <td className="px-5 py-4 text-white/70">
                          {row.participants}
                        </td>

                        <td className="px-5 py-4 text-white/70">
                          {row.winners}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/ctf/${row.slug || row.id}`}
                            className="inline-flex rounded-md border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-[#ff1f45]/70"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LEADERBOARD BUTTON */}
            <div className="flex justify-center pt-4">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.4)] transition-all duration-300 hover:bg-[#ff003c]"
              >
                View Leaderboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock3,
  Radio,
  Trophy,
  Users
} from "lucide-react";
import { events } from "@/utils/constants";
import { formatDateTime } from "@/utils/formatters";

const scoreboard = [
  { rank: 1, team: "PBKS", score: 9850 },
  { rank: 2, team: "Cypher Knights", score: 8720 },
  { rank: 3, team: "The Exploiters", score: 7410 },
  { rank: 4, team: "pwn4fun", score: 6120 },
  { rank: 5, team: "0xDeadBeef", score: 5890 }
];

const upcomingCards = [
  {
    id: "CTF4-Turkey",
    month: "MAY",
    day: "15",
    title: "CTF4 CYBER CHALLENGE",
    copy: "Dive into Capture The Flag challenges and test your hacking skills.",
    duration: "24 Hours",
    players: "200+ Players",
    difficulty: "Med-Hard"
  },
  {
    id: "UNI6CTF ONLINE WARZONE",
    month: "DECEMBER",
    day: "15",
    title: "UNI6CTF ONLINE WARZONE",
    copy: "Break the ciphers. Decode, decrypt and conquer.",
    duration: "48 Hours",
    players: "1000+ Players",
    difficulty: "MED"
  },
  {
    id: "UNI6CTF 2.0",
    month: "SOON",
    day: "SOON",
    title: "UNI6CTF 2.0",
    copy: "Perfect for newcomers. Learn practical CTF workflows fast.",
    duration: "24 Hours",
    players: "1000+ Teams",
    difficulty: "Medium"
  }
];

const pastRows = [
  { event: "UNI6CTF 2025 Quals", duration: "24 Hours", participants: "2,153", winners: "Ethereal Hackers", date: "Apr 20 - Apr 21, 2025" },
  { event: "Spring Breach CTF", duration: "24 Hours", participants: "1,784", winners: "Cypher Knights", date: "Mar 16 - Mar 17, 2025" },
  { event: "LockDown CTF", duration: "24 Hours", participants: "1,512", winners: "pwn4fun", date: "Feb 24 - Feb 25, 2025" },
  { event: "Winter Warzone CTF", duration: "24 Hours", participants: "1,256", winners: "0xDeadBeef", date: "Jan 20 - Jan 21, 2025" }
];

export default function CTFPage() {
  const liveEvent = events.find((event) => event.status === "live") ?? events[0];

  return (
    <main className="bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.75) 100%), radial-gradient(circle at left, rgba(255,0,55,0.18), transparent 45%), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1900&q=80')"
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,31,69,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,31,69,0.16)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
          <p className="text-sm text-white/70">Home <span className="mx-2">&gt;</span> CTF</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff1f45]">Cyber Competition Network</p>
          <h1 className="mt-3 font-teko text-[88px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_28px_rgba(255,0,60,0.5)] md:text-[108px]">
            CTF
          </h1>
          <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/80">
            Compete. Learn. Secure the future. Join our Capture The Flag events and challenge your skills with hackers around the world.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-1 w-full max-w-[1400px] px-6 pb-14 pt-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,8,8,0.95)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="grid h-[78px] grid-cols-3 text-center text-lg font-semibold uppercase tracking-[0.06em]">
            <Link href="/ctf/live" className="group relative flex items-center justify-center gap-3 border-r border-white/10 bg-black/50 text-[#ff1f45] transition-all duration-300">
              <Radio className="h-5 w-5" /> Live CTF
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff003c] shadow-[0_0_18px_rgba(255,0,60,0.8)]" />
            </Link>
            <Link href="/ctf/upcoming" className="group flex items-center justify-center gap-3 border-r border-white/10 text-white/70 transition-all duration-300 hover:bg-[#14080b] hover:text-white">
              <Calendar className="h-5 w-5" /> Upcoming CTF
            </Link>
            <Link href="/ctf/past" className="group flex items-center justify-center gap-3 text-white/70 transition-all duration-300 hover:bg-[#14080b] hover:text-white">
              <Clock3 className="h-5 w-5" /> Past CTF
            </Link>
          </div>

          <div className="space-y-10 border-t border-white/10 p-6 md:p-8">
            <div>
              <div className="mb-5 flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff003c]" /> Live CTF
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080808] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/50 hover:shadow-[0_0_35px_rgba(255,0,60,0.2)]">
                  <div className="grid md:grid-cols-[0.95fr_1.25fr]">
                    <div className="relative min-h-[290px] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=900&q=80" alt="Live CTF" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-[#18040a]/30 to-transparent" />
                    </div>
                    <div className="p-6 md:p-8">
                      <span className="inline-flex rounded-md bg-[#0e2f17] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6dff91]">Live</span>
                      <h2 className="mt-3 font-teko text-6xl uppercase leading-[0.85] tracking-[0.01em] text-white">UNI6CTF GLOBAL</h2>
                      <p className="mt-3 text-white/75">ONLINE </p>
                      <div className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#ff1f45]" /> Live</span>
                        <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#ff1f45]" /> 24/7 Hours</span>
                        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#ff1f45]" /> 150+ Teams </span>
                      </div>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link href={`/ctf/${liveEvent.id}`} className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]">Join CTF <ChevronRight className="h-4 w-4" /></Link>
                        <Link href={`/ctf/${liveEvent.id}`} className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#18090d]">View Details</Link>
                      </div>
                    </div>
                  </div>
                </article>

                <aside className="rounded-2xl border border-white/10 bg-[#080808] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold uppercase tracking-[0.08em]">Live Scoreboard</h3>
                    <Link href="/leaderboard" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#ff1f45]">View Full</Link>
                  </div>
                  <div className="mt-6 space-y-1">
                    <div className="grid grid-cols-[56px_1fr_90px] border-b border-white/10 pb-3 text-xs uppercase tracking-[0.12em] text-white/45">
                      <span>Rank</span><span>Team</span><span className="text-right">Score</span>
                    </div>
                    {scoreboard.map((entry) => (
                      <div key={entry.rank} className="grid grid-cols-[56px_1fr_90px] items-center border-b border-white/10 py-3 text-sm text-white/85">
                        <span className="font-bold text-[#ff1f45]">{entry.rank}</span>
                        <span>{entry.team}</span>
                        <span className="text-right">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]"><span className="h-2.5 w-2.5 rounded-full bg-[#ffd61f]" /> Upcoming CTF</div>
                <Link href="/ctf/upcoming" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#ffd61f]">View All Upcoming</Link>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {upcomingCards.map((card) => (
                  <article key={card.id} className="group rounded-xl border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/60 hover:shadow-[0_0_22px_rgba(255,0,60,0.22)]">
                    <span className="inline-flex rounded-md bg-[#312806] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#ffd61f]">Registration Open</span>
                    <div className="mt-4 flex gap-4">
                      <div className="grid h-20 w-16 place-content-center rounded-lg border border-white/20 bg-black/60 text-center">
                        <span className="text-xs font-bold uppercase text-[#ff1f45]">{card.month}</span>
                        <span className="font-teko text-4xl leading-none">{card.day}</span>
                      </div>
                      <div>
                        <h3 className="font-teko text-[42px] uppercase leading-[0.85]">{card.title}</h3>
                        <p className="mt-2 text-sm text-white/70">{card.copy}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1"><Clock3 className="h-4 w-4 text-[#ff1f45]" /> {card.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4 text-[#ff1f45]" /> {card.players}</span>
                      <span className="flex items-center gap-1"><Activity className="h-4 w-4 text-[#ff1f45]" /> {card.difficulty}</span>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Link href={`/ctf/${card.id}`} className="inline-flex items-center gap-2 rounded-md bg-[#ffcf00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:brightness-105">Register Now <ChevronRight className="h-4 w-4" /></Link>
                      <Link href={`/ctf/${card.id}`} className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70">View Details</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.08em]"><span className="h-2.5 w-2.5 rounded-full bg-white/65" /> Past CTF</div>
                <Link href="/ctf/past" className="text-sm font-semibold uppercase tracking-[0.08em] text-white/70">View All Past Events</Link>
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
                      <tr key={row.event} className="border-t border-white/10 bg-[#080808] text-sm transition-colors duration-300 hover:bg-[#12090c]">
                        <td className="px-5 py-4 font-medium">{row.event}</td>
                        <td className="px-5 py-4 text-white/70">{row.date}</td>
                        <td className="px-5 py-4 text-white/70">{row.duration}</td>
                        <td className="px-5 py-4 text-white/70">{row.participants}</td>
                        <td className="px-5 py-4 text-white/70">{row.winners}</td>
                        <td className="px-5 py-4 text-right"><Link href="/leaderboard" className="inline-flex rounded-md border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-[#ff1f45]/70">View Details</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#ff1f45]/60 bg-[linear-gradient(90deg,rgba(14,6,8,0.98),rgba(30,8,12,0.9))] px-6 py-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-[#ff1f45]/50 bg-[#18070a] text-[#ff1f45]"><Trophy className="h-6 w-6" /></div>
            <div>
              <h3 className="font-teko text-5xl uppercase leading-[0.85]">Think You Have What It Takes?</h3>
              <p className="text-white/75">Join our upcoming events and compete against the best hackers.</p>
            </div>
          </div>
          <Link href="/leaderboard" className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.4)] transition-all duration-300 hover:bg-[#ff003c]">View Leaderboard <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}

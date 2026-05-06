import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock3,
  Cpu,
  Flag,
  HelpCircle,
  Info,
  Medal,
  Shield,
  Swords,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { events } from "@/utils/constants";
import { formatDateTime } from "@/utils/formatters";

const categories = [
  { name: "WEB", challenges: 15, description: "Exploit web vulnerabilities and secure the flag.", difficulty: "Medium", color: "#ff375f" },
  { name: "CRYPTO", challenges: 10, description: "Solve cryptographic puzzles and ciphers.", difficulty: "Hard", color: "#ff9d2f" },
  { name: "PWN", challenges: 10, description: "Binary exploitation and reverse engineering.", difficulty: "Hard", color: "#c051ff" },
  { name: "FORENSICS", challenges: 5, description: "Analyze and uncover hidden evidence.", difficulty: "Medium", color: "#40ff7f" },
  { name: "REVERSE", challenges: 5, description: "Reverse, analyze and decode binaries.", difficulty: "Hard", color: "#50b3ff" }
];

const prizes = [
  { label: "Winner", value: "$1500", sub: "+ Goodies & Certificate", color: "#ffce45" },
  { label: "Runner Up", value: "$1000", sub: "+ Goodies & Certificate", color: "#d7dde8" },
  { label: "2nd Runner Up", value: "$500", sub: "+ Goodies & Certificate", color: "#d38a58" },
  { label: "Top 10 Teams", value: "Swags", sub: "Exclusive Swags & Certificates", color: "#ff375f" }
];

export default async function EventDetailPage({ params }) {
  const { eventId } = await params;
  const event = events.find((item) => item.id === eventId);

  if (!event) notFound();

  return (
    <main className="bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.85) 42%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.75) 100%), radial-gradient(circle at left, rgba(255,0,55,0.18), transparent 45%), url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1900&q=80')"
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,31,69,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,31,69,0.16)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 py-14 md:py-16">
          <p className="text-sm text-white/70">Home <span className="mx-2">&gt;</span> CTF <span className="mx-2">&gt;</span> {event.name}</p>
          <span className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#0e2f17] px-3 py-1 text-sm font-semibold uppercase tracking-[0.1em] text-[#6dff91]">
            <span className="h-2 w-2 rounded-full bg-[#6dff91]" /> Live
          </span>
          <h1 className="mt-4 max-w-[800px] font-teko text-[84px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_30px_rgba(255,0,60,0.45)] md:text-[112px]">{event.name}</h1>
          <p className="mt-4 max-w-[720px] text-2xl text-[#ff375f]">The ultimate battle is live.</p>
          <p className="mt-2 max-w-[720px] text-xl leading-9 text-white/80">Prove your skills, exploit vulnerabilities, and capture the flags. Are you ready to become the champion?</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-7 py-4 text-base font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_26px_rgba(255,0,60,0.42)] transition-all duration-300 hover:bg-[#ff003c]">
              <Zap className="h-5 w-5" /> Join CTF Now
            </Link>
            <Link href="/leaderboard" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-4 text-base font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#17080d]">
              <Trophy className="h-5 w-5" /> View Scoreboard
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[rgba(8,8,8,0.95)] p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/50">Event Ends In</p>
                <div className="mt-3 grid grid-cols-4 gap-4">
                  {[
                    ["02", "Days"],
                    ["14", "Hours"],
                    ["37", "Mins"],
                    ["19", "Secs"]
                  ].map(([num, label]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-black/35 px-3 py-3 text-center">
                      <p className="font-teko text-5xl leading-none text-[#ff1f45]">{num}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.1em] text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-[#ff1f45]" /><div><p className="text-white/55">Start Date</p><p className="text-base text-white">{formatDateTime(event.startsAt)}</p></div></div>
                <div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-[#ff1f45]" /><div><p className="text-white/55">Duration</p><p className="text-base text-white">48 Hours</p></div></div>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-[#ff1f45]" /><div><p className="text-white/55">Players</p><p className="text-base text-white">1,842+</p></div></div>
                <div className="flex items-center gap-2"><ActivityIcon /><div><p className="text-white/55">Difficulty</p><p className="text-base text-white">Hard</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(8,8,8,0.95)]">
          <div className="grid h-[72px] grid-cols-5 border-b border-white/10 text-sm font-semibold uppercase tracking-[0.08em]">
            {[
              ["Overview", Info, true],
              ["Challenges", Swords, false],
              ["Rules", Shield, false],
              ["Prizes", Trophy, false],
              ["FAQ", HelpCircle, false]
            ].map(([label, Icon, active]) => (
              <button key={label} className={`relative flex items-center justify-center gap-2 transition-all duration-300 ${active ? "bg-black/50 text-[#ff1f45]" : "text-white/75 hover:bg-[#12090d] hover:text-white"}`}>
                <Icon className="h-4 w-4" /> {label}
                {active ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff003c] shadow-[0_0_18px_rgba(255,0,60,0.8)]" /> : null}
              </button>
            ))}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <article className="rounded-xl border border-white/10 bg-[#080808] p-5">
                <h2 className="text-2xl font-bold uppercase tracking-[0.06em]">About This CTF</h2>
                <p className="mt-4 leading-7 text-white/75">UNI6CTF 2026 Finals is the flagship Capture The Flag competition organized by UNI6CTF. This final round brings together the best hackers from around the world to compete in a high-intensity cybersecurity challenge.</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2"><Flag className="h-4 w-4 text-[#ff1f45]" /> Real-world inspired challenges</li>
                  <li className="flex items-center gap-2"><Flag className="h-4 w-4 text-[#ff1f45]" /> Multiple domains and difficulty levels</li>
                  <li className="flex items-center gap-2"><Flag className="h-4 w-4 text-[#ff1f45]" /> Compete solo or as a team</li>
                  <li className="flex items-center gap-2"><Flag className="h-4 w-4 text-[#ff1f45]" /> Learn, share and grow with the community</li>
                </ul>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#080808] p-5">
                <h2 className="text-2xl font-bold uppercase tracking-[0.06em]">Event Timeline</h2>
                <div className="mt-4 space-y-4 border-l border-white/15 pl-4">
                  <div><p className="text-sm text-white/60">May 10, 2026</p><p className="text-white">Registrations Opened</p></div>
                  <div><p className="text-sm text-white/60">May 18, 2026 - 10:00 AM UTC</p><p className="text-white">CTF Starts</p></div>
                  <div><p className="text-sm text-white/60">May 20, 2026 - 10:00 AM UTC</p><p className="text-white">CTF Ends</p></div>
                  <div><p className="text-sm text-white/60">May 23, 2026</p><p className="text-white">Winners Announcement</p></div>
                </div>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#080808] p-5">
                <h2 className="text-2xl font-bold uppercase tracking-[0.06em]">CTF Details</h2>
                <div className="mt-4 divide-y divide-white/10 text-sm text-white/80">
                  {[
                    ["Format", "Jeopardy"],
                    ["Team Size", "1 - 4 Members"],
                    ["Participants", "Open to All"],
                    ["Platform", "Custom Platform"],
                    ["Writeups", "Available after CTF"],
                    ["Certificates", "For All Participants"]
                  ].map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-3"><span>{key}</span><span className="text-white">{val}</span></div>
                  ))}
                </div>
              </article>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080808] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase tracking-[0.06em]">Challenge Categories</h2>
                <p className="text-white/60">Total Challenges: <span className="text-white">45</span></p>
              </div>
              <div className="grid gap-4 lg:grid-cols-5">
                {categories.map((cat) => (
                  <article key={cat.name} className="rounded-lg border border-white/10 bg-black/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/30" style={{ boxShadow: `0 0 0 rgba(0,0,0,0), 0 0 0 ${cat.color}` }}>
                    <h3 className="font-teko text-4xl uppercase leading-none" style={{ color: cat.color }}>{cat.name}</h3>
                    <p className="text-sm text-white/80">{cat.challenges} Challenges</p>
                    <p className="mt-3 text-sm text-white/70">{cat.description}</p>
                    <p className="mt-3 text-sm" style={{ color: cat.color }}>{cat.difficulty}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              <article className="rounded-xl border border-white/10 bg-[#080808] p-5">
                <p className="text-xs uppercase tracking-[0.1em] text-white/50">Prize Pool</p>
                <h3 className="mt-2 font-teko text-7xl leading-[0.85] text-[#ff375f]">$3000+</h3>
                <p className="text-white/75">Worth of prizes</p>
                <p className="mt-3 text-sm text-white/65">Cash prizes, goodies, and exclusive swags for winners.</p>
                <Link href="/leaderboard" className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-[#ff1f45]/70">View Prizes</Link>
              </article>
              {prizes.map((prize) => (
                <article key={prize.label} className="rounded-xl border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30" style={{ boxShadow: `0 0 30px color-mix(in oklab, ${prize.color} 15%, transparent)` }}>
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5" style={{ color: prize.color }} />
                    <p className="text-xs uppercase tracking-[0.1em] text-white/60">{prize.label}</p>
                  </div>
                  <p className="mt-3 font-teko text-6xl leading-[0.85]" style={{ color: prize.color }}>{prize.value}</p>
                  <p className="mt-2 text-sm text-white/70">{prize.sub}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ActivityIcon() {
  return <Cpu className="h-5 w-5 text-[#ff1f45]" />;
}

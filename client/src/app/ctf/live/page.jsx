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
import { fetchCms } from "@/lib/cmsApi";
import { mapCtfToCard } from "@/lib/ctfMapper";
import { formatDateTime } from "@/utils/formatters";
import { CountdownTimer } from "@/components/CountdownTimer";

export default async function LiveCTFPage() {
  const ctfRes = await fetchCms("/ctfs?status=live&limit=100");
  const events = (ctfRes?.ctfs || []).map(mapCtfToCard);
  const liveEvents = events.filter((event) => event.status === "live");

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
          <p className="text-sm text-white/70">Home <span className="mx-2">&gt;</span> CTF <span className="mx-2">&gt;</span> Live</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff1f45]">Live Events</p>
          <h1 className="mt-3 font-teko text-[88px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_28px_rgba(255,0,60,0.5)] md:text-[108px]">
            LIVE CTF
          </h1>
          <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/80">
            Currently running Capture The Flag events. Join the action and compete in real-time.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-14 pt-8">
        {liveEvents.length === 0 ? (
          <div className="text-center py-20">
            <Radio className="mx-auto h-16 w-16 text-white/30" />
            <h2 className="mt-6 font-teko text-4xl uppercase tracking-[0.01em] text-white/70">
              No Live Events
            </h2>
            <p className="mt-4 text-white/60">There are currently no live CTF events running.</p>
            <Link
              href="/ctf/upcoming"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]"
            >
              View Upcoming Events <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {liveEvents.map((event) => (
              <article key={event.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#080808] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/50 hover:shadow-[0_0_35px_rgba(255,0,60,0.2)]">
                <div className="grid md:grid-cols-[0.95fr_1.25fr]">
                  <div className="relative min-h-[290px] overflow-hidden">
                    <img src={event.image} alt={event.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-[#18040a]/30 to-transparent" />
                  </div>
                  <div className="p-6 md:p-8">
                    <span className="inline-flex rounded-md bg-[#0e2f17] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6dff91]">Live</span>
                    <h2 className="mt-3 font-teko text-6xl uppercase leading-[0.85] tracking-[0.01em] text-white">{event.name}</h2>
                    <p className="mt-3 text-white/75">{event.format}</p>
                    <div className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#ff1f45]" /> {formatDateTime(event.startsAt)}</span>
                      <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#ff1f45]" /> {event.duration}</span>
                      <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#ff1f45]" /> {event.players}</span>
                    </div>
                    <div className="mt-8">
                      <CountdownTimer
                        startDate={event.startsAt}
                        endDate={event.endsAt}
                        status={event.status}
                      />
                    </div>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href={`/ctf/${event.id}/register`} className="inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]">Join CTF <ChevronRight className="h-4 w-4" /></Link>
                      <Link href={`/ctf/${event.id}`} className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70 hover:bg-[#18090d]">View Details</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

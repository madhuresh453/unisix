import Link from "next/link";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock3,
  Trophy,
  Users
} from "lucide-react";
import { events } from "@/utils/constants";
import { CountdownTimer } from "@/components/CountdownTimer";

export default function UpcomingCTFPage() {
  const upcomingEvents = events.filter((event) => event.status === "upcoming");

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

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <p className="text-sm text-white/70">Home <span className="mx-2">&gt;</span> CTF <span className="mx-2">&gt;</span> Upcoming</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd61f]">Upcoming Events</p>
          <h1 className="mt-3 font-teko text-[88px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_28px_rgba(255,0,60,0.5)] md:text-[108px]">
            UPCOMING CTF
          </h1>
          <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/80">
            Get ready for upcoming Capture The Flag events. Register early to secure your spot.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="mx-auto h-16 w-16 text-white/30" />
            <h2 className="mt-6 font-teko text-4xl uppercase tracking-[0.01em] text-white/70">
              No Upcoming Events
            </h2>
            <p className="mt-4 text-white/60">There are currently no upcoming CTF events scheduled.</p>
            <Link
              href="/ctf/past"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]"
            >
              View Past Events <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article key={event.id} className="group rounded-xl border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1f45]/60 hover:shadow-[0_0_22px_rgba(255,0,60,0.22)]">
                <span className="inline-flex rounded-md bg-[#312806] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#ffd61f]">
                  {event.registrationOpen ? "Registration Open" : "Upcoming"}
                </span>
                <div className="mt-4 flex gap-4">
                  <div className="grid h-20 w-16 place-content-center rounded-lg border border-white/20 bg-black/60 text-center">
                    <span className="text-xs font-bold uppercase text-[#ff1f45]">{new Date(event.startsAt).toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span>
                    <span className="font-teko text-4xl leading-none">{new Date(event.startsAt).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="font-teko text-[42px] uppercase leading-[0.85]">{event.name}</h3>
                    <p className="mt-2 text-sm text-white/70">{event.description.slice(0, 90)}...</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1"><Clock3 className="h-4 w-4 text-[#ff1f45]" /> {event.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4 text-[#ff1f45]" /> {event.players || event.teams}</span>
                  <span className="flex items-center gap-1"><Activity className="h-4 w-4 text-[#ff1f45]" /> {event.difficulty}</span>
                </div>
                <div className="mt-5">
                  <CountdownTimer
                    startDate={event.startsAt}
                    endDate={event.endsAt}
                    status={event.status}
                  />
                </div>
                <div className="mt-5 flex gap-3">
                  <Link href={`/ctf/${event.slug || event.id}/register`} className="inline-flex items-center gap-2 rounded-md bg-[#ffcf00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-all duration-300 hover:brightness-105">Register Now <ChevronRight className="h-4 w-4" /></Link>
                  <Link href={`/ctf/${event.slug || event.id}`} className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[#ff1f45]/70">View Details</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

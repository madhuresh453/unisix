import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  Trophy,
  Users
} from "lucide-react";
import { fetchCms } from "@/lib/cmsApi";
import { mapCtfToCard } from "@/lib/ctfMapper";
import { formatDate } from "@/utils/formatters";

export default async function PastCTFPage() {
  const ctfRes = await fetchCms("/ctfs?status=past&limit=200");
  const events = (ctfRes?.ctfs || []).map(mapCtfToCard);
  const pastEvents = events.filter((event) => event.status === "past");

  return (
    <main className="bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.75) 100%), radial-gradient(circle at left, rgba(255,0,55,0.18), transparent 45%), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1000&q=80')"
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,31,69,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,31,69,0.16)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <p className="text-sm text-white/70">Home <span className="mx-2">&gt;</span> CTF <span className="mx-2">&gt;</span> Past</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Past Events</p>
          <h1 className="mt-3 font-teko text-[88px] uppercase leading-[0.85] tracking-[0.01em] text-white drop-shadow-[0_0_28px_rgba(255,0,60,0.5)] md:text-[108px]">
            PAST CTF
          </h1>
          <p className="mt-5 max-w-[520px] text-lg leading-8 text-white/80">
            Archive of completed Capture The Flag events. View results and learn from past competitions.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        {pastEvents.length === 0 ? (
          <div className="text-center py-20">
            <Clock3 className="mx-auto h-16 w-16 text-white/30" />
            <h2 className="mt-6 font-teko text-4xl uppercase tracking-[0.01em] text-white/70">
              No Past Events
            </h2>
            <p className="mt-4 text-white/60">There are currently no past CTF events to display.</p>
            <Link
              href="/ctf/upcoming"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ff1f45] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(255,0,60,0.45)] transition-all duration-300 hover:bg-[#ff003c]"
            >
              View Upcoming Events <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
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
                {pastEvents.map((event) => (
                  <tr key={event.id} className="border-t border-white/10 bg-[#080808] text-sm transition-colors duration-300 hover:bg-[#12090c]">
                    <td className="px-5 py-4 font-medium">{event.name}</td>
                    <td className="px-5 py-4 text-white/70">{formatDate(event.startsAt)} - {formatDate(event.endsAt)}</td>
                    <td className="px-5 py-4 text-white/70">{event.duration}</td>
                    <td className="px-5 py-4 text-white/70">{event.participants}</td>
                    <td className="px-5 py-4 text-white/70">{event.winners.join(", ")}</td>
                    <td className="px-5 py-4 text-right"><Link href={`/ctf/${event.slug || event.id}`} className="inline-flex rounded-md border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-[#ff1f45]/70">View Details</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Trophy,
  Users,
} from "lucide-react";

import { events } from "@/utils/constants";
import {
  formatDateTime,
  getCountdownParts,
} from "@/utils/formatters";

export default async function EventDetailsPage({ params }) {
  // NEXT JS 15 FIX
  const { eventId } = await params;

  // SUPPORT BOTH ID + SLUG
  const event = events.find(
    (e) =>
      e.slug === eventId ||
      e.id === eventId
  );

  // NOT FOUND
  if (!event) {
    notFound();
  }

  const countdown = getCountdownParts(event.startsAt);

  const isLive = event.status === "live";
  const isPast = event.status === "past";
  const isUpcoming = event.status === "upcoming";

  return (
    <main className="bg-[#050505] text-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(
              180deg,
              rgba(5,5,5,0.92) 0%,
              rgba(5,5,5,0.74) 36%,
              rgba(5,5,5,0.92) 100%
            ), url('${event.image}')`,
          }}
        />

        {/* GRID OVERLAY */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,31,69,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,31,69,0.16)_1px,transparent_1px)] [background-size:85px_85px]" />

        {/* GLOW EFFECT */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,31,69,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,0,60,0.14),transparent_30%)]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-6 py-20 md:py-28">
          {/* BREADCRUMB */}
          <p className="text-sm uppercase tracking-[0.32em] text-white/50">
            Home
            <span className="mx-2">&gt;</span>

            <Link
              href="/ctf"
              className="text-white/80 transition hover:text-[#ff1f45]"
            >
              CTF
            </Link>

            <span className="mx-2">&gt;</span>

            {event.name}
          </p>

          {/* STATUS */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]
              ${
                isLive
                  ? "bg-[#0e2f17] text-[#6dff91]"
                  : isUpcoming
                  ? "bg-[#312806] text-[#ffd61f]"
                  : "bg-white/10 text-white/80"
              }`}
            >
              {event.status}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mt-6 max-w-4xl font-teko text-[60px] uppercase leading-[0.88] tracking-[-0.02em] text-white drop-shadow-[0_0_36px_rgba(255,0,60,0.35)] md:text-[108px]">
            {event.name}
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            {event.description}
          </p>

          {/* STATS */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* START DATE */}
            <div className="rounded-[28px] border border-white/10 bg-[#080808]/95 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
              <Calendar className="mx-auto h-8 w-8 text-[#ff1f45]" />

              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/50">
                Start Date
              </p>

              <p className="mt-3 font-teko text-2xl uppercase text-white">
                {formatDateTime(event.startsAt)}
              </p>
            </div>

            {/* DURATION */}
            <div className="rounded-[28px] border border-white/10 bg-[#080808]/95 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
              <Clock3 className="mx-auto h-8 w-8 text-[#ff1f45]" />

              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/50">
                Duration
              </p>

              <p className="mt-3 font-teko text-2xl uppercase text-white">
                {event.duration}
              </p>
            </div>

            {/* TEAMS */}
            <div className="rounded-[28px] border border-white/10 bg-[#080808]/95 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
              <Users className="mx-auto h-8 w-8 text-[#ff1f45]" />

              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/50">
                Teams
              </p>

              <p className="mt-3 font-teko text-2xl uppercase text-white">
                {event.teams}
              </p>
            </div>

            {/* PRIZE */}
            <div className="rounded-[28px] border border-white/10 bg-[#080808]/95 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
              <Trophy className="mx-auto h-8 w-8 text-[#ff1f45]" />

              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/50">
                Prize Pool
              </p>

              <p className="mt-3 font-teko text-2xl uppercase text-white">
                {event.prizePool}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      {isUpcoming && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-14">
          <div className="rounded-[32px] border border-[#ff1f45]/60 bg-[rgba(14,6,8,0.98)] p-10 text-center shadow-[0_40px_120px_rgba(255,0,60,0.14)]">
            <h2 className="font-teko text-4xl uppercase tracking-[0.01em] text-white">
              Event Starts In
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-4">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((block) => (
                <div
                  key={block.label}
                  className="rounded-[28px] border border-white/10 bg-[#080808]/95 p-6"
                >
                  <p className="font-teko text-6xl text-[#ff1f45]">
                    {block.value}
                  </p>

                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/60">
                    {block.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* LEFT */}
          <div className="space-y-8">
            {/* CATEGORIES */}
            <div>
              <h2 className="font-teko text-5xl uppercase tracking-[0.01em]">
                Challenge Categories
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {event.categories.map((category) => (
                  <div
                    key={category}
                    className="rounded-[28px] border border-white/10 bg-[#080808] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-6 w-6 text-[#ff1f45]" />

                      <span className="font-semibold uppercase tracking-[0.08em]">
                        {category}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-white/70">
                      Experience dynamic category challenges built for exploit
                      hunters, cryptographers, and reverse engineers.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-8">
            <div className="rounded-[32px] border border-white/10 bg-[#080808] p-8">
              <h2 className="font-teko text-5xl uppercase tracking-[0.01em]">
                FAQ
              </h2>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="font-semibold uppercase tracking-[0.08em]">
                    How do I register?
                  </h3>

                  <p className="mt-3 text-white/70">
                    Click the register button below and complete the form.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold uppercase tracking-[0.08em]">
                    Can individuals participate?
                  </h3>

                  <p className="mt-3 text-white/70">
                    Yes, solo participants are welcome.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-14">
        <div className="rounded-[32px] border border-[#ff1f45]/60 bg-[linear-gradient(180deg,rgba(14,6,8,0.98),rgba(30,8,12,0.92))] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-teko text-4xl uppercase text-white">
                Ready to Compete?
              </h3>

              <p className="mt-2 text-sm text-white/70">
                Register now and claim your place.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {!isPast && (
                <Link
                  href={`/ctf/${event.slug || event.id}/register`}
                  className="inline-flex items-center gap-3 rounded-full bg-[#ff1f45] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#ff003c]"
                >
                  {isLive ? "Join CTF Now" : "Register Now"}

                  <ChevronRight className="h-5 w-5" />
                </Link>
              )}

              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-[#0b0b0d]/90 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-[#ff1f45]/70"
              >
                View Scoreboard
              </Link>

              <Link
                href="/ctf"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-[#0b0b0d]/90 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-[#ff1f45]/70"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to CTF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
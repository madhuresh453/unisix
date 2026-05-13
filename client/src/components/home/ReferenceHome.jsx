"use client";

import Image from "next/image";
import { useMemo } from "react";

import {
  ArrowRight,
  Award,
  Box,
  Cloud,
  Flag,
  Github,
  Globe2,
  Medal,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { events } from "@/utils/constants";

const stats = [
  { icon: Flag, value: "3+", label: "CTF Events", sub: "Hosted" },
  { icon: Users, value: "1100+", label: "Participants", sub: "Worldwide" },
  { icon: Globe2, value: "15+", label: "Countries", sub: "Involved" },
  { icon: Trophy, value: "90+", label: "Challenges", sub: "Published" },
];

const achievements = [
  {
    icon: Medal,
    title: "Top 6",
    body: "INTERNATIONAL CTF rankings",
    year: "2026",
  },
  {
    icon: Trophy,
    title: "6th Place",
    body: "CYBER WAR 2026 ",
    year: "LOVELY PROFESSIONAL UNIVERSITY",
  },
  {
    icon: Award,
    title: "Largest",
    eyebrow: "Hosted India's",
    body: "UNI6CTF 1.0",
    year: "2026",
  },
  {
    icon: Users,
    title: "15K+",
    eyebrow: "Strong community",
    body: "Members and growing",
  },
];

const partners = [
  { icon: ShieldCheck, name: "UNISIX SECURITY", sub: "COMPANY" },
  { icon: Box, name: "THUNDER CIPHER", sub: "Sponsor" },
  { name: "SmartED Innovations", sub: "Institution", mark: "S" },
  { icon: Github, name: "CYBER HUNTER WARRIORS", sub: "" },
  { icon: ShieldCheck, name: "CYBER LEELAWAT", sub: "Cyber Educator" },
  { icon: Cloud, name: "SUS CC", sub: "Community" },
];

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[13px] font-black uppercase leading-none tracking-[0.18em] text-cyber-red text-red-glow">
        || {children}
      </span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  );
}

function StatItem({ stat, last }) {
  const Icon = stat.icon;

  return (
    <div
      className={`group flex items-center gap-4 px-6 py-6 transition-all duration-300 sm:gap-6 ${last ? "" : "lg:border-r lg:border-white/[0.08]"}`}
    >
      <span className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.02] text-cyber-red shadow-[inset_0_0_26px_rgba(255,255,255,0.03)] transition-all duration-300 group-hover:border-cyber-red/55 group-hover:shadow-glow-card sm:h-[78px] sm:w-[78px]">
        <Icon className="h-7 w-7 stroke-[1.8] red-glow transition-all duration-300 group-hover:scale-110 sm:h-9 sm:w-9" />
      </span>
      <div>
        <p className="font-display text-[28px] font-black uppercase leading-none text-cyber-red text-red-glow sm:text-[32px]">
          {stat.value}
        </p>
        <p className="mt-3 text-[12px] font-bold uppercase leading-5 tracking-[0.08em] text-white sm:text-[14px]">
          {stat.label}
        </p>
        <p className="text-[12px] font-bold uppercase leading-5 tracking-[0.08em] text-white sm:text-[14px]">
          {stat.sub}
        </p>
      </div>
    </div>
  );
}

function TrophyArt() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-5 hidden h-full w-[270px] overflow-hidden lg:block xl:w-[310px]">
      <div className="absolute bottom-8 right-8 text-cyber-red">
        <Trophy className="h-32 w-32 stroke-[1.1] drop-shadow-[0_0_34px_rgba(255,0,0,0.75)] xl:h-40 xl:w-40" />
        <div className="relative left-1/2 mt-1 h-8 w-36 -translate-x-1/2 border-x border-t border-cyber-red/70" />
        <div className="relative left-1/2 h-5 w-44 -translate-x-1/2 border border-cyber-red/45 bg-black/30" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_55%,rgba(255,0,0,0.42),transparent_42%)]" />
      <div className="absolute bottom-0 right-0 h-32 w-72 bg-[radial-gradient(circle,rgba(255,26,26,0.35)_1px,transparent_2px)] bg-[length:9px_9px] opacity-60" />
    </div>
  );
}

export function ReferenceHome() {
  const liveEvent = useMemo(
    () => events.find((item) => item.status === "live") || events[0],
    [],
  );

  return (
    <main className="relative overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,26,26,0.11)_1px,transparent_1px),linear-gradient(rgba(255,26,26,0.08)_1px,transparent_1px)] bg-[size:96px_96px] opacity-[0.075]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_66%_28%,rgba(255,0,0,0.36),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0)_0%,#050505_96%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 border-r border-cyber-red/10 bg-[linear-gradient(135deg,transparent_30%,rgba(255,26,26,0.24)_31%,transparent_32%)] opacity-50" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 border-l border-cyber-red/10 bg-[linear-gradient(135deg,transparent_30%,rgba(255,26,26,0.24)_31%,transparent_32%)] opacity-50" />

      <section className="relative w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[460px] overflow-hidden rounded-xl border border-white/[0.08] sm:min-h-[520px] lg:min-h-[608px]">
            <div className="absolute inset-0">
              <Image
                src="/images/uni6ctf-hero.png"
                alt="Hooded hacker at a laptop with red cyber interface"
                fill
                priority
                sizes="(min-width: 1200px) 1400px, 100vw"
                className="h-full w-full object-cover object-[55%_center] opacity-100"
              />
            </div>

            <div className="relative w-full px-4 pb-8 pt-0 sm:px-6 md:px-8">
              <div className="w-full pt-[58px] sm:pt-[74px]">
                <p className="text-[13px] font-black uppercase tracking-[0.18em] text-cyber-red text-red-glow sm:text-[15px]">
                  Capture the Flag
                </p>
                <h1 className="mt-5 text-[clamp(3.45rem,13vw,5.1rem)] font-black uppercase leading-[0.88] tracking-[0.01em] text-white sm:text-[76px] lg:text-[82px] xl:text-[92px]">
                  <span className="block font-cyber-title text-white drop-shadow-[0_0_11px_rgba(255,255,255,0.22)]">
                    Hack. Learn.
                  </span>
                  <span className="block font-cyber-title text-cyber-red drop-shadow-[0_0_22px_rgba(255,0,0,0.48)]">
                    Compete. Grow.
                  </span>
                </h1>
                <p className="mt-6 w-full text-[16px] leading-[1.55] text-[#ffffff]/90 sm:text-[18px]">
                  UNI6CTF is a cybersecurity platform that <br />
                  organizes and hosts CTF competitions
                  <br /> to challenge, educate and empower
                  <br /> the next generation of hackers.
                </p>
                <div className="mt-8 flex flex-col gap-4 min-[430px]:flex-row">
                  <Button
                    href="/ctf/live"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="min-h-[48px] rounded-md px-6 w-full sm:w-auto"
                  >
                    Join Live CTF
                  </Button>
                  <Button
                    href="/ctf"
                    variant="secondary"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="min-h-[48px] rounded-md border-white/[0.28] bg-white/[0.02] px-6 w-full sm:w-auto"
                  >
                    Explore Events
                  </Button>
                </div>
              </div>

              <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 items-center xl:flex">
                <div className="flex items-center border border-red-500/30 bg-black/40 px-3 py-4 shadow-[0_0_20px_rgba(255,0,0,0.25)]">
                  <p className="vertical-text text-[12px] font-bold uppercase tracking-[0.45em] text-white/70">
                    DEFEND | EXPLOIT | ELEVATE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-md border border-white/20 bg-[#070b0d]/92 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              last={index === stats.length - 1}
            />
          ))}
        </div>
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative min-h-[262px] overflow-hidden rounded-md border border-cyber-red/65 bg-[#05090b]/92 px-6 py-7 shadow-[inset_0_0_50px_rgba(255,26,26,0.04),0_0_22px_rgba(255,26,26,0.12)] sm:py-8">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,0,0,0.11),transparent_28%,rgba(255,0,0,0.08),transparent_70%)]" />
          <TrophyArt />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-[14px] font-black uppercase tracking-[0.14em] text-cyber-red text-red-glow">
                <span className="h-3 w-3 rounded-full bg-cyber-red shadow-glow" />
                Registration Open
              </p>
              <h2 className="mt-5 font-cyber-title text-[28px] font-black uppercase leading-none tracking-[0.07em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] sm:text-[36px]">
                {liveEvent.name}
              </h2>
              <p className="mt-4 w-full text-[16px] leading-7 text-white/88">
                {liveEvent.location || liveEvent.format || "Live event in progress"}
              </p>
              <Button
                href={`/ctf/${liveEvent.slug || liveEvent.id}`}
                icon={ArrowRight}
                iconPosition="right"
                className="mt-5 min-h-[48px] rounded-md px-7"
              >
                Join Now
              </Button>
            </div>
            <div className="relative z-10 flex flex-col justify-center gap-7 lg:pr-[190px] xl:pr-[220px]">
              <CountdownTimer
                startDate={liveEvent.startsAt}
                endDate={liveEvent.endsAt}
                status={liveEvent.status}
              />
              <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white/78 sm:text-[13px]">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  Players Online
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]" />
                  {liveEvent.participants || liveEvent.players || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full grid max-w-7xl gap-8 px-4 py-5 sm:px-6 md:grid-cols-[154px_1fr] md:items-center lg:grid-cols-[190px_1fr_1fr_168px] lg:px-8">
        <div className="hidden md:flex">
          <div className="relative grid h-[154px] w-[154px] place-items-center rounded-full border border-cyber-red/25 bg-cyber-red/5 text-cyber-red">
            <div className="absolute inset-3 rounded-full border border-cyber-red/30" />
            <Image
              src="/images/UNI6CTF -final logo.png"
              alt="UNI6CTF Logo"
              width={90}
              height={90}
              className="
    h-[90px]
    w-[90px]
    rounded-full
    object-cover
    border
    border-cyber-red/40
    shadow-[0_0_22px_rgba(255,0,0,0.35)]
    red-glow
  "
            />
          </div>
        </div>
        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.16em] text-cyber-red text-red-glow">
            || About UNI6CTF
          </p>
          <h2 className="mt-5 font-cyber-title text-[34px] font-black uppercase leading-[1.05] tracking-[0.06em] text-white">
            Building The Future
            <span className="block text-cyber-red">Of Cybersecurity</span>
          </h2>
        </div>
        <p className="text-[14px] leading-[1.65] text-white/78">
          We are a passionate group of cybersecurity enthusiasts on a mission to
          build a strong, competitive and inclusive hacking community through
          CTFs, knowledge sharing and innovation.
        </p>
        <Button
          href="/about"
          variant="secondary"
          icon={ArrowRight}
          iconPosition="right"
          className="rounded-md border-white/[0.28] bg-white/[0.02] md:justify-self-start lg:justify-self-auto"
        >
          Read Our Story
        </Button>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <SectionLabel>Our Achievements</SectionLabel>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={`${achievement.title}-${achievement.body}`}
                className="min-h-[154px] rounded-md border border-white/12 bg-[#071012]/80 p-7"
              >
                <div className="grid grid-cols-[58px_1fr] gap-5">
                  <Icon className="h-12 w-12 text-cyber-red red-glow transition-all duration-300" />
                  <div>
                    {achievement.eyebrow ? (
                      <p className="text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-white/75">
                        {achievement.eyebrow}
                      </p>
                    ) : null}
                    <h3 className="font-display text-[22px] font-black uppercase leading-none tracking-[0.05em] text-cyber-red">
                      <span className="text-red-glow">{achievement.title}</span>
                    </h3>
                    <p className="mt-2 text-[13px] font-bold uppercase leading-5 tracking-[0.07em] text-white">
                      {achievement.body}
                    </p>
                    {achievement.year ? (
                      <p className="mt-4 text-[13px] text-white/42">
                        {achievement.year}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center sm:justify-end">
  <Button
    href="/achievements"
    variant="secondary"
    icon={ArrowRight}
    iconPosition="right"
    className="
      min-h-[52px]
      rounded-xl
      border
      border-white/[0.14]
      bg-white/[0.03]
      px-7
      text-[14px]
      font-black
      uppercase
      tracking-[0.08em]
      shadow-[0_0_20px_rgba(255,255,255,0.04)]
      transition-all
      duration-300
      hover:border-cyber-red/50
      hover:bg-cyber-red/10
      hover:shadow-[0_0_24px_rgba(255,0,0,0.2)]
    "
  >
    View All Achievements
  </Button>
</div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-11 pt-4 sm:px-6 lg:px-8">
        <SectionLabel>Our Partners</SectionLabel>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group flex min-h-[78px] items-center gap-3 rounded-md border border-white/12 bg-[#071012]/84 px-6 py-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center text-white">
                  {Icon ? (
                    <Icon className="h-8 w-8 stroke-[1.8] transition-all duration-300 group-hover:text-cyber-red" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-red-500 text-lg font-black shadow-glow">
                      {partner.mark}
                    </span>
                  )}
                </span>
                <span>
                  <span className="block text-[15px] font-black uppercase leading-none tracking-[0.06em] text-white">
                    {partner.name}
                  </span>
                  {partner.sub ? (
                    <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.18em] text-white/58">
                      {partner.sub}
                    </span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <span className="h-2.5 w-3 rounded-full bg-cyber-red" />
          <span className="h-2.5 w-3 rounded-full border border-cyber-red/60" />
          <span className="h-2.5 w-3 rounded-full border border-cyber-red/60" />
          <span className="h-2.5 w-3 rounded-full border border-cyber-red/60" />
        </div>
      </section>
    </main>
  );
}

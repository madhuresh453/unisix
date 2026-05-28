import Link from "next/link";
import { fetchCms } from "@/lib/cmsApi";
import {
  BadgeCheck,
  Eye,
  Gem,
  Lightbulb,
  Flag,
  Users,
  Rocket,
  Quote,
  Shield,
  Globe,
  Trophy,
  BookOpen,
  Send,
  Github,
  Radio,
  MessageCircle,
  ArrowUpRight,
  ChevronRight,
  Play,
  Heart,
} from "lucide-react";

const defaultMissionCards = [
  {
    icon: BadgeCheck,
    title: "OUR MISSION",
    body: "To empower the next generation of cybersecurity professionals through engaging CTF challenges, learning opportunities and community collaboration.",
  },
  {
    icon: Eye,
    title: "OUR VISION",
    body: "To become a global leader in cybersecurity education and CTF competitions, creating a safer digital world through knowledge and innovation.",
  },
  {
    icon: Gem,
    title: "OUR VALUES",
    list: [
      "Security First",
      "Integrity & Fairness",
      "Learning & Growth",
      "Community & Collaboration",
      "Innovation & Excellence",
    ],
  },
];

const defaultTimelineItems = [
  {
    icon: Lightbulb,
    year: "2026 March",
    title: "THE BEGINNING",
    body: "UNI6CTF started as a small idea among a group of college students who shared the same passion for cybersecurity and ethical hacking.",
  },
  {
    icon: Flag,
    year: "2026 April",
    title: "FIRST CTF EVENT",
    body: "We hosted our first CTF competition with participation from across India. The overwhelming response motivated us to go bigger.",
  },
  {
    icon: Users,
    year: "2026",
    title: "GROWING COMMUNITY",
    body: "More events, more learners, more collaboration. UNI6CTF became a name trusted by thousands of security enthusiasts.",
  },
  {
    icon: Rocket,
    year: "2026 AND BEYOND",
    title: "BUILDING THE FUTURE",
    body: "We are constantly evolving by bringing advanced challenges, new features and global opportunities for all hackers.",
  },
];

const defaultStats = [
  { icon: Shield, value: "3+", label: "CTF EVENTS HOSTED" },
  { icon: Users, value: "1100", label: "PARTICIPANTS WORLDWIDE" },
  { icon: Globe, value: "15+", label: "COUNTRIES INVOLVED" },
  { icon: Trophy, value: "90+", label: "CHALLENGES PUBLISHED" },
  { icon: BookOpen, value: "10k+", label: "COMMUNITY MEMBERS" },
];

const quickLinks = [
  "Home",
  "About Us",
  "CTF Events",
  "Leaderboard",
  "Writeups",
  "Sponsors",
  "Contact",
];
const resources = [
  "Blog",
  "Practice Arena",
  "Hall of Fame",
  "FAQ",
  "Rules",
  "Privacy Policy",
];
const community = ["Discord Server", "Telegram Group", "GitHub", "YouTube"];

export default async function AboutPage() {
  const aboutRes = await fetchCms("/content/about");
  const aboutSettings = aboutRes?.settings || {};
  const missionCards = aboutSettings.missionCards?.length ? aboutSettings.missionCards : defaultMissionCards;
  const timelineItems = aboutSettings.timelineItems?.length ? aboutSettings.timelineItems : defaultTimelineItems;
  const stats = aboutSettings.stats?.length ? aboutSettings.stats : defaultStats;
  const founder = aboutSettings.founder || {};
  return (
    <main className="relative overflow-hidden bg-[#040404] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,0,50,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,50,0.03)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,0,43,0.24),transparent_38%),radial-gradient(circle_at_82%_23%,rgba(255,0,43,0.16),transparent_30%),radial-gradient(circle_at_68%_68%,rgba(132,2,18,0.2),transparent_45%),linear-gradient(180deg,#060709_0%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,43,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,43,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#ff1f45]/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#ff1f45]/70 to-transparent" />
      </div>

      <section className="relative z-10 overflow-hidden border-b border-[#ff1f45]/20 bg-[#050505] min-h-screen">
  
  {/* BACKGROUND EFFECTS */}
  <div className="absolute inset-0">
    
    
    {/* RED RADIAL GLOW */}
    

    {/* GRID LINES */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,43,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,43,0.04)_1px,transparent_1px)] bg-[size:52px_52px] opacity-30" />

    {/* SIDE RED LINES */}
    <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#ff2149]/70 to-transparent" />
    <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#ff2149]/70 to-transparent" />
  </div>

  {/* MAIN CONTAINER */}
  <div className="relative z-10 mx-auto
  grid max-w-[1450px]
  gap-16
  px-8
  py-14
  lg:grid-cols-[480px_1fr]
  items-center
">

    {/* LEFT CONTENT */}
    <div className="relative z-20 max-w-[500px]">

      {/* BREADCRUMB */}
      <div className="mb-6 flex items-center gap-2 text-[13px] text-white/55">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>

        <ChevronRight className="h-4 w-4 text-[#ff2248]" />

        <span>About Us</span>
      </div>

      {/* SMALL TITLE */}
      <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.22em] text-[#ff2d52]">
        ABOUT UNI6CTF
      </p>

      {/* MAIN TITLE */}
      <h1
        style={{ fontFamily: "Teko, Inter, sans-serif" }}
        className="
  text-[78px]
  sm:text-[92px]
  xl:text-[108px]
  font-bold
  uppercase
  leading-[0.82]
  tracking-[0.01em]
  text-white
  drop-shadow-[0_0_18px_rgba(255,30,70,0.18)]
"
      >
        WHO
        <br />
        WE ARE
      </h1>

      {/* DESCRIPTION */}
      <p className="
  mt-7
  max-w-[520px]
  text-[18px]
  leading-[1.85]
  text-white/78
">
        UNI6CTF is a cybersecurity platform built by passionate security
        enthusiasts to organize, host and promote Capture The Flag (CTF)
        competitions worldwide. We aim to challenge minds, discover
        talent and build a strong cybersecurity community.
      </p>

      {/* BUTTONS */}
      <div className="mt-9 flex items-center gap-3">

        {/* MAIN BUTTON */}
        <Link
          href="#"
          className="
            group inline-flex h-12 items-center
            rounded-[10px]
            border border-[#ff2a50]/70
            bg-[#ff1740]
            px-6
            text-[13px]
            font-semibold
            uppercase
            tracking-[0.05em]
            text-white
            shadow-[0_0_20px_rgba(255,18,58,0.35)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_0_28px_rgba(255,18,58,0.58)]
          "
        >
          JOIN OUR COMMUNITY

          <ArrowUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {/* SOCIAL BUTTONS */}
        {[
          { icon: MessageCircle, label: "Discord" },
          { icon: Send, label: "Telegram" },
          { icon: Github, label: "GitHub" },
          { icon: Radio, label: "X" },
        ].map((social) => {
          const Icon = social.icon;

          return (
            <Link
              key={social.label}
              href="#"
              aria-label={social.label}
              className="
                group inline-flex
                h-12 w-12
                items-center justify-center
                rounded-[10px]
                border border-white/15
                bg-[#0a0d12]/72
                backdrop-blur-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-[#ff2b4f]/60
                hover:bg-[#12070b]
                hover:shadow-[0_0_18px_rgba(255,32,74,0.38)]
              "
            >
              <Icon className="h-5 w-5 text-white/90 transition-all duration-300 group-hover:scale-110 group-hover:text-[#ff375b]" />
            </Link>
          );
        })}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="
  relative
  flex items-center justify-center
  min-h-[420px]
  lg:min-h-[560px]
">

      {/* RED GLOW */}


      {/* IMAGE CONTAINER */}
      <div className="
  relative
  w-full
  max-w-[700px]
  h-[520px]
  overflow-hidden
  rounded-[12px]
  border border-white/[0.08]
  bg-[#050505]
  shadow-[0_0_40px_rgba(0,0,0,0.45)]
">

        {/* MAIN IMAGE */}
        <img
          src="/images/mposter.png"
          alt="Cyber Hacker"
          className="
  absolute inset-0
  h-full w-full
  object-contain
  object-right
  opacity-100
"
        />

       
      </div>
    </div>
  </div>
</section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {missionCards.map((card, index) => {
            const Icon = card.icon || defaultMissionCards[index % defaultMissionCards.length].icon;
            return (
              <article
                key={card.title}
                className="group rounded-xl border border-white/15 bg-[linear-gradient(145deg,#091018,#05070b)] p-7 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#ff3155]/60 hover:shadow-[0_0_28px_rgba(255,27,65,0.2)]"
              >
                <Icon className="h-9 w-9 text-[#ff274b] transition duration-300 group-hover:scale-110" />
                <h2
                  style={{ fontFamily: "Teko, Inter, sans-serif" }}
                  className="mt-5 text-4xl font-semibold uppercase tracking-[0.06em]"
                >
                  {card.title}
                </h2>
                {card.body ? (
                  <p className="mt-3 text-lg leading-8 text-white/78">
                    {card.body}
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-lg text-white/80">
                    {card.list?.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff2a4f]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-6 block h-0.5 w-16 bg-[#ff264b]" />
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <article className="rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(16,21,31,0.75),rgba(8,10,14,0.82))] p-7 backdrop-blur-md">
            <h3
              style={{ fontFamily: "Teko, Inter, sans-serif" }}
              className="text-5xl font-semibold uppercase tracking-[0.05em]"
            >
              OUR <span className="text-[#ff2f54]">STORY</span>
            </h3>
            <div className="mt-6 space-y-6">
              {timelineItems.map((item, index) => {
                const Icon = item.icon || defaultTimelineItems[index % defaultTimelineItems.length].icon;
                return (
                  <div
                    key={item.title}
                    className="grid grid-cols-[72px_1fr] gap-5"
                  >
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#ff3257]/35 bg-[#0c0f15]">
                        <Icon className="h-6 w-6 text-[#ff2c51]" />
                      </div>
                      {index !== timelineItems.length - 1 && (
                        <span className="absolute left-7 top-16 h-[calc(100%+1.1rem)] w-px bg-gradient-to-b from-[#ff2d53] to-[#4b0b17]" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold uppercase tracking-wide text-[#ff3559]">
                        {item.year}
                      </p>
                      <h4
                        style={{ fontFamily: "Teko, Inter, sans-serif" }}
                        className="text-4xl font-medium uppercase leading-none tracking-[0.04em]"
                      >
                        {item.title}
                      </h4>
                      <p className="mt-2 text-lg leading-8 text-white/75">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(16,21,31,0.75),rgba(8,10,14,0.82))] p-7 backdrop-blur-md">
            <img
              src="/images/mbluni6.png"
              alt="Founder cyber visual"
              className="absolute bottom-0 right-0 h-[100%] w-[60%] object-cover object-[72%_center] opacity-70 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.97)_0%,rgba(7,8,10,0.78)_46%,rgba(7,8,10,0.58)_100%)]" />
            <div className="relative z-10 max-w-[62%] min-w-[280px]">
              <h3
                style={{ fontFamily: "Teko, Inter, sans-serif" }}
                className="text-5xl font-semibold uppercase tracking-[0.05em]"
              >
                BY THE <span className="text-[#ff3054]">FOUNDER</span>
              </h3>
              <Quote className="mt-4 h-12 w-12 text-[#ff2a4f]" />
              <p className="mt-4 text-lg leading-8 text-white/82">
                {founder.quote || "UNI6CTF is not just a platform, it is a movement. Our goal is to break barriers, create opportunities and inspire every individual to explore the world of cybersecurity with curiosity and confidence. Together, we hack. We learn. We secure."}
              </p>
              <div
                className="mt-7 text-4xl text-white/90"
                style={{ fontFamily: "cursive" }}
              >
                {founder.name || "Madhuresh kumar jha"}
                
              </div>
              <p className="mt-2 text-2xl font-semibold text-[#ff3559]">
                {founder.title || "CEO & Founder"}
              </p>
              <p className="text-lg text-white/75">{founder.org || "UNI6CTF"}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1500px] px-6 pb-8">
        <div className="grid gap-2 rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(10,14,20,0.82),rgba(7,8,12,0.9))] p-2 backdrop-blur-md md:grid-cols-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon || defaultStats[index % defaultStats.length].icon;
            return (
              <article
                key={stat.label}
                className="group rounded-lg border border-white/10 bg-[#090d14]/70 p-5 transition duration-300 hover:border-[#ff3155]/60 hover:shadow-[0_0_18px_rgba(255,33,71,0.22)]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-[#ff3358]/35 p-2.5">
                    <Icon className="h-5 w-5 text-[#ff2d52] transition group-hover:scale-110" />
                  </div>
                  <div>
                    <p
                      style={{ fontFamily: "Teko, Inter, sans-serif" }}
                      className="text-5xl font-semibold leading-none text-[#ff2f54]"
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium uppercase tracking-wide text-white/85">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

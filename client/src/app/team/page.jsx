import { TeamHero } from "@/components/team/TeamHero";
import { TeamStats } from "@/components/team/TeamStats";
import { TeamSection } from "@/components/team/TeamSection";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { JoinTeamCTA } from "@/components/team/JoinTeamCTA";
import { TeamFooter } from "@/components/team/TeamFooter";
import { PageShell } from "@/components/ui/PageShell";
import { fetchCms } from "@/lib/cmsApi";

const defaultCoreTeam = [
  {
    name: "Krish Pathania",
    title: "Co-Founder & Chief Operating Officer",
    description: "Cyber command strategist leading elite operations, product vision, and mission architecture.",
    badge: "CF"
  },
  {
    name: "Raj Kumar ",
    title: "Chief Operating Officer & Chief Information Security Officer ",
    description: "Adversary simulation lead focused on red team strategy, risk operations, and security posture.",
    badge: "CISO"
  },
  {
    name: "TanishPreet Singh",
    title: "Chief Technology Officer",
    description: "Real-time exploit orchestration specialist powering live events, infrastructure, and response.",
    badge: "CTO"
  },
  {
    name: "Prabhjot singh",
    title: "Operations Manager",
    description: "Threat analysis architect delivering campaign insights, surveillance, and attacker tradecraft.",
    badge: "LEAD"
  },
  {
    name: "Jaspreet Singh",
    title: "Operations Manager",
    description: "Infrastructure commander building secure pipelines, automation, and tactical deployments.",
    badge: "LEAD"
  }
];

const defaultDevelopers = [
  {
    name: "Madhuresh Kumar Jha",
    title: "Software Lead & PURPLE TEAMING",
    description: "Designs the core platform, APIs, and backend systems for mission-critical delivery."
  },
  {
    name: "Raj Kumar",
    title: "FORENSICS EXPERT & BLUE TEAMING",
    description: "Builds secure, scalable systems for live scoring, telemetry, and event orchestration."
  },
  {
    name: "Krish Pathania",
    title: "FORENSICS EXPERT & BLUE TEAMING",
    description: "Owns architecture for resilient challenge systems, data flow, and performance tuning."
  },
  {
    name: "TanishPreet Singh",
    title: "REVERSE Engineer & RED TEAMING",
    description: "Crafts polished interfaces, dashboard flows, and tactical display experiences."
  },
  {
    name: "Prabhjot Singh",
    title: "OSINT Analyst",
    description: "Delivers secure integrations, platform extensibility, and developer tooling."
  },
  {
    name: "Jaspreet Singh",
    title: "OSINT Analyst",
    description: "Connects advanced hardware telemetry and field devices to cyber operations systems."
  }
];

const defaultResearchers = [
  {
    name: "Raj Kumar",
    title: "Senior Researcher",
    description: "Security researcher focused on malware analysis, exploit discovery, and forensic tooling."
  },
  {
    name: "Tanishpreet Singh",
    title: "R.E Specialist",
    description: "Cryptanalysis lead driving cipher hunts, protocol audits, and challenge review."
  },
  {
    name: "Anoynmous",
    title: "Penetration Tester",
    description: "Exercises infrastructure and product attack surfaces across every UNI6CTF mission."
  }
];

const defaultOrganizers = [
  {
    name: "IN-0x0",
    title: "Event ORGANIZER",
    description: "Coordinates global launches, competition logistics, and real-time event command."
  },
  {
    name: "UNI6CTF",
    title: "CTF",
    description: "Builds elite hacker networks, partnerships, and recruitment campaigns."
  },
  {
    name: "UNISIX SECURITY",
    title: "SECURITY PROVIDER",
    description: "Manages mission resources, timelines, and secure coordination for large-scale events."
  }
];

export default async function TeamPage() {
  const teamRes = await fetchCms("/content/team");
  const members = Array.isArray(teamRes?.members) ? teamRes.members : [];
  const coreTeam = members.filter((member) => member.group === "core");
  const developers = members.filter((member) => member.group === "developers");
  const researchers = members.filter((member) => member.group === "researchers");
  const organizers = members.filter((member) => member.group === "organizers");

  const safeCoreTeam = coreTeam.length ? coreTeam : defaultCoreTeam;
  const safeDevelopers = developers.length ? developers : defaultDevelopers;
  const safeResearchers = researchers.length ? researchers : defaultResearchers;
  const safeOrganizers = organizers.length ? organizers : defaultOrganizers;
  return (
    <PageShell className="grid gap-16 pb-20">
      <TeamHero />
      <TeamStats />

      <TeamSection title="CORE TEAM" description="Senior directors, squad leads, and threat architects.">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {safeCoreTeam.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={member.socials?.length ? member.socials : [
              { type: "github", href: "#" },
              { type: "linkedin", href: "#" },
              { type: "discord", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="DEVELOPERS" description="Engineering the platform, tooling, and user experience for elite operations.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {safeDevelopers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={member.socials?.length ? member.socials : [
              { type: "github", href: "#" },
              { type: "linkedin", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="SECURITY RESEARCHERS" description="Focused experts in cryptography, exploitation, and defensive analysis.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeResearchers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={member.socials?.length ? member.socials : [
              { type: "github", href: "#" },
              { type: "linkedin", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="ORGANIZERS" description="The event and community operators driving every UNI6CTF campaign.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeOrganizers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={member.socials?.length ? member.socials : [
              { type: "linkedin", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <JoinTeamCTA />
      
    </PageShell>
  );
}

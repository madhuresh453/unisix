import { TeamHero } from "@/components/team/TeamHero";
import { TeamStats } from "@/components/team/TeamStats";
import { TeamSection } from "@/components/team/TeamSection";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { JoinTeamCTA } from "@/components/team/JoinTeamCTA";
import { TeamFooter } from "@/components/team/TeamFooter";
import { PageShell } from "@/components/ui/PageShell";

const coreTeam = [
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
    title: "Chief Technology Officer)",
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

const developers = [
  {
    name: "Madhuresh Kumar Jha",
    title: "Software Lead",
    description: "Designs the core platform, APIs, and backend systems for mission-critical delivery."
  },
  {
    name: "Raj Kumar",
    title: "Platform Engineer",
    description: "Builds secure, scalable systems for live scoring, telemetry, and event orchestration."
  },
  {
    name: "Krish Pathania",
    title: "Backend Architect",
    description: "Owns architecture for resilient challenge systems, data flow, and performance tuning."
  },
  {
    name: "TanishPreet Singh",
    title: "UX Engineer",
    description: "Crafts polished interfaces, dashboard flows, and tactical display experiences."
  },
  {
    name: "Prabhjot Singh",
    title: "API Specialist",
    description: "Delivers secure integrations, platform extensibility, and developer tooling."
  },
  {
    name: "Jaspreet Singh",
    title: "Firmware Integrator",
    description: "Connects advanced hardware telemetry and field devices to cyber operations systems."
  }
];

const researchers = [
  {
    name: "Raj Kumar",
    title: "Senior Researcher",
    description: "Security researcher focused on malware analysis, exploit discovery, and forensic tooling."
  },
  {
    name: "Tanishpreet Singh",
    title: "Crypto Specialist",
    description: "Cryptanalysis lead driving cipher hunts, protocol audits, and challenge review."
  },
  {
    name: "Anoynmous",
    title: "Penetration Tester",
    description: "Exercises infrastructure and product attack surfaces across every UNI6CTF mission."
  }
];

const organizers = [
  {
    name: "Rohan Iyer",
    title: "Event Operations",
    description: "Coordinates global launches, competition logistics, and real-time event command."
  },
  {
    name: "Harley Storm",
    title: "Community Director",
    description: "Builds elite hacker networks, partnerships, and recruitment campaigns."
  },
  {
    name: "Suri Blake",
    title: "Logistics Lead",
    description: "Manages mission resources, timelines, and secure coordination for large-scale events."
  }
];

export default function TeamPage() {
  return (
    <PageShell className="grid gap-16 pb-20">
      <TeamHero />
      <TeamStats />

      <TeamSection title="CORE TEAM" description="Senior directors, squad leads, and threat architects.">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {coreTeam.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={[
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
          {developers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={[
              { type: "github", href: "#" },
              { type: "linkedin", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="SECURITY RESEARCHERS" description="Focused experts in cryptography, exploitation, and defensive analysis.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {researchers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={[
              { type: "github", href: "#" },
              { type: "linkedin", href: "#" },
              { type: "website", href: "#" }
            ]} />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="ORGANIZERS" description="The event and community operators driving every UNI6CTF campaign.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizers.map((member) => (
            <TeamMemberCard key={member.name} {...member} socials={[
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

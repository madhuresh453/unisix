import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

const members = [
  { name: "Aarav Singh", role: "Platform Lead", specialty: "Web exploitation, architecture" },
  { name: "Mei Tan", role: "Crypto Lead", specialty: "Cryptanalysis, challenge review" },
  { name: "Lena Ortiz", role: "Forensics Lead", specialty: "Memory, malware, blue team labs" },
  { name: "Rohan Iyer", role: "Infrastructure", specialty: "Realtime systems, deployments" }
];

export default function TeamPage() {
  return (
    <PageShell className="grid gap-10">
      <SectionHeader
        eyebrow="Team"
        title="Operators, challenge authors, and community builders"
        body="The UNI6CTF team blends exploit developers, defenders, educators, and event producers."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <Card key={member.name} glow>
            <div className="grid h-20 w-20 place-items-center rounded-xl border border-cyber-red/35 bg-cyber-red/10 text-2xl font-black uppercase shadow-glow">
              {member.name.slice(0, 2)}
            </div>
            <h2 className="mt-5 text-xl font-black uppercase">{member.name}</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-cyber-red">{member.role}</p>
            <p className="mt-3 text-sm leading-6 text-cyber-muted">{member.specialty}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

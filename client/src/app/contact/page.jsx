import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <PageShell className="grid gap-10">
      <SectionHeader
        eyebrow="Contact"
        title="Bring UNI6CTF to your campus, lab, or event"
        body="Use this intake for partnerships, event hosting, challenge authoring, and responsible disclosure collaboration."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card glow>
          <h2 className="text-2xl font-black uppercase">Operations</h2>
          <div className="mt-5 grid gap-4 text-cyber-muted">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-cyber-red" />
              hello@uni6ctf.local
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-cyber-red" />
              Global remote community
            </p>
          </div>
        </Card>
        <form className="cyber-panel grid gap-4 rounded-xl p-5">
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <Input as="select" className="text-white">
            <option>Host a CTF</option>
            <option>Sponsor UNI6CTF</option>
            <option>Submit challenge</option>
          </Input>
          <Input as="textarea" placeholder="Tell us what you are building" />
          <Button icon={Send}>Send request</Button>
        </form>
      </div>
    </PageShell>
  );
}

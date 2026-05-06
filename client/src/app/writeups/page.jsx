import { WriteupGrid } from "@/components/writeups/WriteupGrid";
import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WriteupsPage() {
  return (
    <PageShell className="grid gap-8">
      <SectionHeader
        eyebrow="Writeups"
        title="Learn from solved attacks"
        body="A searchable archive of walkthroughs across web, crypto, forensics, pwn, OSINT, cloud, and reverse engineering."
      />
      <WriteupGrid />
    </PageShell>
  );
}

import WriteupGrid from "@/components/writeups/WriteupGrid";
import { fetchCms } from "@/lib/cmsApi";

import { PageShell } from "@/components/ui/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default async function WriteupsPage() {
  const writeupRes = await fetchCms("/writeups?limit=100");
  const writeups = (writeupRes?.writeups || []).map((item) => ({
    ...item,
    author: item.author?.name || item.author?.handle || "Anonymous",
    readTime: item.readTime || "5 MIN"
  }));
  const categories = ["ALL", ...new Set(writeups.map((item) => String(item.category || "").toUpperCase()).filter(Boolean))];
  return (
    <PageShell className="grid gap-8">
      <SectionHeader
        eyebrow="Writeups"
        title="Learn from solved attacks"
        body="A searchable archive of walkthroughs across web, crypto, forensics, pwn, OSINT, cloud, and reverse engineering."
      />

      <WriteupGrid categories={categories} writeups={writeups} />
    </PageShell>
  );
}

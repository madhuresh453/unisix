import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { PageShell } from "@/components/ui/PageShell";
import { writeups } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";

export default async function WriteupDetailPage({ params }) {
  const { slug } = await params;
  const writeup = writeups.find((item) => item.slug === slug);

  if (!writeup) notFound();

  return (
    <PageShell>
      <article className="cyber-panel w-full rounded-xl p-6 md:p-10">
        <Badge>{writeup.category}</Badge>
        <h1 className="mt-5 text-4xl font-black uppercase leading-tight md:text-6xl">{writeup.title}</h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">
          {writeup.author} / {formatDate(writeup.publishedAt)} / {writeup.readTime}
        </p>
        <p className="mt-8 text-lg leading-8 text-cyber-muted">{writeup.content}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {writeup.tags.map((tag) => (
            <Badge key={tag} tone="zinc">{tag}</Badge>
          ))}
        </div>
      </article>
    </PageShell>
  );
}

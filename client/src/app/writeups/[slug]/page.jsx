import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { PageShell } from "@/components/ui/PageShell";

import { fetchCms } from "@/lib/cmsApi";
import { formatDate } from "@/utils/formatters";

export default async function WriteupDetailPage({
  params,
}) {
  // NEXT JS 15 FIX
  const { slug } = await params;

  const response = await fetchCms(`/writeups/${slug}`);
  const writeup = response?.writeup
    ? {
        ...response.writeup,
        author: response.writeup.author?.name || response.writeup.author?.handle || "Anonymous",
        readTime: response.writeup.readTime || "5 min read"
      }
    : null;

  // NOT FOUND
  if (!writeup) {
    notFound();
  }

  return (
    <PageShell>
      <article className="cyber-panel mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#080808] p-6 md:p-10">
        {/* CATEGORY */}
        <Badge>
          {writeup.category || "Writeup"}
        </Badge>

        {/* TITLE */}
        <h1 className="mt-5 text-4xl font-black uppercase leading-tight text-white md:text-6xl">
          {writeup.title ||
            "Untitled Writeup"}
        </h1>

        {/* META */}
        <p className="mt-4 flex flex-wrap gap-2 text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">
          <span>
            {writeup.author ||
              "Anonymous"}
          </span>

          <span>/</span>

          <span>
            {writeup.publishedAt
              ? formatDate(
                  writeup.publishedAt
                )
              : "Unknown Date"}
          </span>

          <span>/</span>

          <span>
            {writeup.readTime ||
              "5 min read"}
          </span>
        </p>

        {/* COVER IMAGE */}
        {writeup.image ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={writeup.image}
              alt={writeup.title}
              className="h-full max-h-[420px] w-full object-cover"
            />
          </div>
        ) : null}

        {/* CONTENT */}
        <div className="prose prose-invert mt-10 max-w-none">
          <p className="text-lg leading-8 text-cyber-muted">
            {writeup.content ||
              "No content available for this writeup."}
          </p>
        </div>

        {/* TAGS */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(writeup.tags || []).length >
          0 ? (
            writeup.tags.map((tag) => (
              <Badge
                key={tag}
                tone="zinc"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <Badge tone="zinc">
              No Tags
            </Badge>
          )}
        </div>
      </article>
    </PageShell>
  );
}

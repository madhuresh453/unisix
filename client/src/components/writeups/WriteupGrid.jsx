import Link from "next/link";
import { Search } from "lucide-react";

import {
  categories,
  writeups,
} from "@/utils/constants";

import { Badge } from "@/components/ui/Badge";

function WriteupGrid() {
  const safeCategories = categories || [];
  const safeWriteups = writeups || [];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* SIDEBAR */}
      <aside className="h-fit">
        {/* SEARCH */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090909] px-4 py-4 shadow-[0_0_20px_rgba(255,0,60,0.04)]">
          <Search className="h-4 w-4 text-cyber-muted" />

          <input
            type="text"
            placeholder="Search writeups"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-cyber-muted"
          />
        </div>

        {/* CATEGORY LIST */}
        <div className="mt-5 grid gap-2">
          {safeCategories.length > 0 ? (
            safeCategories
              .slice(0, 4)
              .map((category) => (
                <button
                  key={category}
                  type="button"
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] px-5 py-4 text-left text-sm font-black uppercase tracking-[0.18em] text-cyber-muted transition-all duration-300 hover:border-cyber-red/50 hover:bg-[#140507] hover:text-white"
                >
                  <span>{category}</span>

                  <span className="h-2 w-2 rounded-full bg-cyber-red opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </button>
              ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/40">
              No categories available
            </div>
          )}
        </div>
      </aside>

      {/* WRITEUPS GRID */}
      <div className="grid gap-5 md:grid-cols-2">
        {safeWriteups.length > 0 ? (
          safeWriteups.map((writeup) => (
            <Link
              key={writeup.slug || writeup.id}
              href={
                writeup.slug
                  ? `/writeups/${writeup.slug}`
                  : "#"
              }
              className="group"
            >
              <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#070707] p-6 transition-all duration-300 hover:border-cyber-red/35 hover:bg-[#0a0a0a] hover:shadow-[0_0_40px_rgba(255,0,60,0.08)]">
                {/* TOP META */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>
                    {writeup.category ||
                      "Writeup"}
                  </Badge>

                  <span className="text-xs font-black uppercase tracking-[0.16em] text-cyber-muted">
                    {writeup.readTime ||
                      "5 MIN"}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="mt-7 text-[32px] font-black uppercase leading-[1.1] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-cyber-red">
                  {writeup.title ||
                    "Untitled Writeup"}
                </h2>

                {/* EXCERPT */}
                <p className="mt-5 text-[15px] leading-7 text-cyber-muted">
                  {writeup.excerpt ||
                    "Detailed challenge walkthrough and cybersecurity analysis."}
                </p>

                {/* AUTHOR */}
                <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-cyber-muted">
                  {writeup.author ||
                    "Anonymous"}
                </p>

                {/* HOVER GLOW */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyber-red/10 blur-3xl" />
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-[#080808] px-6 py-20 text-center">
            <h3 className="text-xl font-black uppercase tracking-[0.08em] text-white">
              No Writeups Found
            </h3>

            <p className="mt-4 text-sm text-white/45">
              Writeups will appear here once
              available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriteupGrid;
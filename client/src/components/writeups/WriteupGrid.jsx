import Link from "next/link";
import { Search } from "lucide-react";
import { categories, writeups } from "@/utils/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function WriteupGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="cyber-panel h-fit rounded-xl p-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
          <Search className="h-4 w-4 text-cyber-muted" />
          <input
            placeholder="Search writeups"
            className="w-full bg-transparent text-sm outline-none placeholder:text-cyber-muted"
          />
        </div>
        <div className="mt-5 grid gap-2">
          {categories.slice(0, 4).map((category) => (
            <button
              key={category}
              className="focus-ring rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted transition hover:border-cyber-red/45 hover:text-white"
            >
              {category}
            </button>
          ))}
        </div>
      </aside>
      <div className="grid gap-4 md:grid-cols-2">
        {writeups.map((writeup) => (
          <Link key={writeup.slug} href={`/writeups/${writeup.slug}`}>
            <Card glow className="h-full">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{writeup.category}</Badge>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyber-muted">
                  {writeup.readTime}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black uppercase">{writeup.title}</h2>
              <p className="mt-3 text-sm leading-6 text-cyber-muted">{writeup.excerpt}</p>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-cyber-muted">
                {writeup.author}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

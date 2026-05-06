import Link from "next/link";

export function TeamSection({ title, description, href = "#", children }) {
  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyber-red">{title}</p>
            <span className="block h-0.5 w-16 rounded-full bg-cyber-red" />
          </div>
          {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-cyber-muted">{description}</p> : null}
        </div>
        <Link href={href} className="text-sm font-bold uppercase tracking-[0.24em] text-cyber-red transition hover:text-white">
          View All <span aria-hidden="true">→</span>
        </Link>
      </div>
      {children}
    </section>
  );
}

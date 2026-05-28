import Link from "next/link";

export default function LearningListingPage({ title, items = [], type }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 text-white sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black uppercase tracking-[0.06em]">{title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-cyber-red">{item.difficulty || item.category || "learning"}</p>
            <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-[#9ca3af] line-clamp-3">{item.description || item.storyline || ""}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#9ca3af]">
              <span>{item.premium ? "Premium" : "Free"}</span>
              {item.price ? <span>Rs {item.price}</span> : null}
            </div>
            <Link href={`/${type}/${item.slug}`} className="mt-4 inline-block text-sm font-bold text-cyber-red">View</Link>
          </article>
        ))}
      </div>
    </main>
  );
}

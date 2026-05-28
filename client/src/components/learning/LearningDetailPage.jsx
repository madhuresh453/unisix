export default function LearningDetailPage({ item, type }) {
  if (!item) {
    return <main className="mx-auto max-w-7xl px-4 py-16 text-white">Content not found.</main>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 text-white sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.12em] text-cyber-red">{type.slice(0, -1)}</p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-[0.06em]">{item.title}</h1>
      <p className="mt-4 max-w-3xl text-sm text-[#9ca3af]">{item.description || item.storyline || ""}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#9ca3af]">
        <span className="rounded-full border border-white/10 px-3 py-1">{item.difficulty || item.category || "general"}</span>
        <span className="rounded-full border border-white/10 px-3 py-1">{item.premium ? "Premium" : "Free"}</span>
      </div>
    </main>
  );
}

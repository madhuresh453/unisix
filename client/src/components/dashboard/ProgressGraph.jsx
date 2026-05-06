const values = [20, 28, 34, 41, 48, 58, 64, 72, 84, 92];

export function ProgressGraph() {
  return (
    <div className="cyber-panel rounded-xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase">Progress over time</h2>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyber-muted">30 days</span>
      </div>
      <div className="flex h-56 items-end gap-3">
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 items-end rounded-t-xl bg-white/[0.035]">
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-cyber-red to-white shadow-glow"
              style={{ height: `${value}%` }}
              aria-label={`Progress ${value}%`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-cyber-muted">
      <span className="h-3 w-3 animate-pulse rounded-full bg-cyber-red shadow-glow" />
      {label}
    </div>
  );
}

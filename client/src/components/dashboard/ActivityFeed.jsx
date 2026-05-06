import { activity } from "@/utils/constants";

export function ActivityFeed() {
  return (
    <div className="cyber-panel rounded-xl p-5">
      <h2 className="text-xl font-black uppercase">Recent activity</h2>
      <div className="mt-5 grid gap-4">
        {activity.map((item) => (
          <div key={`${item.event}-${item.time}`} className="border-l-2 border-cyber-red pl-4">
            <p className="font-bold">{item.event}</p>
            <p className="mt-1 text-sm text-cyber-muted">{item.meta}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-cyber-muted">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

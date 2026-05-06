import { submissions } from "@/utils/constants";
import { Badge } from "@/components/ui/Badge";

export function SubmissionList() {
  return (
    <div className="cyber-panel rounded-xl p-5">
      <h2 className="text-xl font-black uppercase">Recent submissions</h2>
      <div className="mt-5 grid gap-3">
        {submissions.map((submission) => (
          <div
            key={`${submission.challenge}-${submission.submittedAt}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div>
              <p className="font-bold">{submission.challenge}</p>
              <p className="mt-1 text-sm text-cyber-muted">{submission.submittedAt}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={submission.status === "accepted" ? "green" : "red"}>{submission.status}</Badge>
              <span className="font-bold tabular-nums">{submission.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

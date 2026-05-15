"use client";

import { useEffect, useRef } from "react";
import { Shield, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TeamModal({ open, team, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open || !team) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Team ${team.team} details`}
        className="cyber-panel w-full max-w-2xl rounded-2xl border border-cyber-red/30 p-6 outline-none animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-cyber-red">Team Profile</p>
            <h3 className="mt-1 font-teko text-4xl uppercase tracking-[0.02em]">{team.team}</h3>
          </div>
          <Button variant="ghost" className="h-10 min-h-10 w-10 px-0" onClick={onClose} aria-label="Close team details modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#080808]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">Rank</p>
            <p className="mt-1 text-lg font-black text-cyber-red">#{team.rank}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#080808]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">Country</p>
            <p className="mt-1 text-lg font-black">{team.country || "Global"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#080808]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">Score</p>
            <p className="mt-1 text-lg font-black tabular-nums">{team.score}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#080808]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-cyber-muted">Points</p>
            <p className="mt-1 text-lg font-black tabular-nums">{team.points}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-cyber-red">
            <Shield className="h-4 w-4" />
            Team Members
          </p>
          <div className="mt-3 max-h-60 space-y-2 overflow-y-auto pr-1">
            {team.members?.length ? (
              team.members.map((member, index) => (
                <div key={`${member.username || member.name}-${index}`} className="rounded-xl border border-white/10 bg-[#080808]/90 p-3">
                  <p className="inline-flex items-center gap-2 font-bold">
                    <User className="h-4 w-4 text-cyber-red" />
                    {member.name || "Unknown"}
                  </p>
                  {member.username ? <p className="mt-1 text-sm text-cyber-muted">@{member.username}</p> : null}
                  <p className="mt-2 inline-flex rounded-full border border-cyber-red/25 bg-cyber-red/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyber-red">
                    {member.role || (index === 0 ? "Captain" : "Core Member")}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-white/10 bg-[#080808]/90 p-3 text-sm text-cyber-muted">
                No member details available for this team.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

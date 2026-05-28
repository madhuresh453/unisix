"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clipboard, Download, FileText, Flag, Lock, MapPin, ShieldCheck, Sparkles, Timer, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/Button";
import TerminalSimulator from "./TerminalSimulator";
import { fetchLabWorkspace, unlockStageHint, submitStageFlag, saveLabNote } from "@/services/labService";

function StatTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-cyber-red">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
    </div>
  );
}

export default function LabWorkspaceShell({ lab, labInstance, canAccess }) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [noteDraft, setNoteDraft] = useState({ title: "Mission notes", content: "" });
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState(null);
  const [hintAction, setHintAction] = useState({ loading: false, message: "" });
  const [saveNoteLoading, setSaveNoteLoading] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  const stageMap = useMemo(() => {
    if (!workspace?.stages) return {};
    return workspace.stages.reduce((map, stage) => ({ ...map, [stage._id]: stage }), {});
  }, [workspace]);

  const activeStage = useMemo(() => {
    const currentId = selectedStageId || workspace?.progress?.currentStage || workspace?.stages?.[0]?._id;
    return currentId ? stageMap[currentId] : workspace?.stages?.[0];
  }, [selectedStageId, stageMap, workspace]);

  const progressSummary = useMemo(() => {
    if (!workspace?.stages) return { completed: 0, total: 0 };
    const completed = workspace.progress?.completedStages?.length || 0;
    return { completed, total: workspace.stages.length };
  }, [workspace]);

  useEffect(() => {
    if (!lab?._id || !canAccess) return;
    let active = true;

    async function loadWorkspace() {
      try {
        const data = await fetchLabWorkspace(lab._id);
        if (!active) return;
        setWorkspace(data);
        setSelectedStageId(data.progress?.currentStage || data.stages?.[0]?._id);
      } catch (error) {
        console.warn("Failed to load lab workspace", error);
      }
    }

    loadWorkspace();
    return () => {
      active = false;
    };
  }, [lab?._id, canAccess]);

  useEffect(() => {
    if (!socket || !lab?._id) return;
    socket.emit("lab:join", { labId: lab._id });

    const handleStageComplete = (payload) => {
      if (payload?.labId !== lab._id) return;
      setActivityLog((current) => [`Stage complete: ${payload.stageId}`, ...current].slice(0, 10));
      if (workspace) {
        setWorkspace((current) => ({ ...current, progress: { ...current.progress, currentStage: payload.nextStage || null, xpEarned: (current.progress.xpEarned || 0) + (payload.xp || 0), status: payload.nextStage ? current.progress.status : "completed" } }));
      }
    };

    const handleFlagCorrect = (payload) => {
      if (payload?.labId !== lab._id) return;
      setActivityLog((current) => [`Correct flag on stage ${payload.stageId}`, ...current].slice(0, 10));
    };

    const handleFlagIncorrect = (payload) => {
      if (payload?.labId !== lab._id) return;
      setActivityLog((current) => [`Incorrect flag attempt`, ...current].slice(0, 10));
    };

    const handleHintUnlock = (payload) => {
      if (payload?.labId !== lab._id) return;
      setActivityLog((current) => [`Hint unlocked: ${payload.stageId}`, ...current].slice(0, 10));
    };

    socket.on("lab:stage:complete", handleStageComplete);
    socket.on("lab:flag:correct", handleFlagCorrect);
    socket.on("lab:flag:incorrect", handleFlagIncorrect);
    socket.on("lab:hint:unlock", handleHintUnlock);

    return () => {
      socket.emit("lab:leave", { labId: lab._id });
      socket.off("lab:stage:complete", handleStageComplete);
      socket.off("lab:flag:correct", handleFlagCorrect);
      socket.off("lab:flag:incorrect", handleFlagIncorrect);
      socket.off("lab:hint:unlock", handleHintUnlock);
    };
  }, [socket, lab?._id, workspace]);

  const selectedHints = activeStage?.hints || [];
  const unlockedHintIds = workspace?.progress?.unlockedHints?.map((hint) => String(hint.hintId)) || [];

  const handleUnlockHint = async (hintId) => {
    if (!workspace || !activeStage) return;
    setHintAction({ loading: true, message: "" });
    try {
      await unlockStageHint(lab._id, activeStage._id, hintId);
      setHintAction({ loading: false, message: "Hint unlocked successfully." });
      setWorkspace((current) => ({ ...current, progress: { ...current.progress, unlockedHints: [...(current.progress.unlockedHints || []), { hintId }] } }));
    } catch (error) {
      setHintAction({ loading: false, message: error.message || "Unable to unlock hint." });
    }
  };

  const handleSubmitFlag = async () => {
    if (!workspace || !activeStage) return;
    setFlagResult(null);
    try {
      const data = await submitStageFlag(lab._id, activeStage._id, flagInput);
      setFlagResult({ success: true, message: data.message || "Flag accepted.", reward: data.reward });
      setFlagInput("");
      setWorkspace((current) => ({ ...current, progress: { ...current.progress, xpEarned: (current.progress.xpEarned || 0) + (data.reward || 0), completedStages: data.progress.completedStages || current.progress.completedStages, currentStage: data.progress.currentStage || current.progress.currentStage, status: data.progress.status || current.progress.status } }));
    } catch (error) {
      setFlagResult({ success: false, message: error.message || "Incorrect flag." });
    }
  };

  const handleSaveNote = async () => {
    if (!lab?._id) return;
    setSaveNoteLoading(true);
    try {
      const { note } = await saveLabNote(lab._id, noteDraft);
      setNoteDraft({ title: note.title, content: note.content });
      setWorkspace((current) => ({ ...current, notes: [note, ...(current.notes || [])] }));
    } catch (error) {
      console.warn(error);
    } finally {
      setSaveNoteLoading(false);
    }
  };

  if (!workspace) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/70 p-8 text-center text-white/80">Loading immersive lab workspace...</div>
    );
  }

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.95fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-[0_0_40px_rgba(255,0,60,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyber-red">Immersive range</p>
              <h3 className="mt-2 text-2xl font-black uppercase text-white">Live attack workspace</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatTile label="Stage" value={activeStage?.title || "Loading"} icon={MapPin} />
              <StatTile label="Progress" value={`${progressSummary.completed}/${progressSummary.total}`} icon={CheckCircle2} />
              <StatTile label="Session" value={labInstance?.status || "inactive"} icon={ShieldCheck} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[0.68fr_0.32fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Stage walkthrough</p>
                  <h4 className="mt-2 text-xl font-black uppercase text-white">{activeStage?.title}</h4>
                </div>
                <span className="rounded-full border border-cyber-red/30 bg-cyber-red/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyber-red">{activeStage?.stageType?.replace(/_/g, " ") || "recon"}</span>
              </div>
              <div className="mt-5 space-y-4 text-sm leading-7 text-cyber-muted">
                <p>{activeStage?.description || "Follow the stage guidance and submit the correct flag to progress."}</p>
                {activeStage?.objectives?.length ? (
                  <ul className="grid gap-2">
                    {activeStage.objectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyber-red" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Target environment</p>
                <div className="mt-4 grid gap-3 text-sm text-cyber-muted">
                  <StatTile label="Host" value={workspace.lab.environment?.targetHost || workspace.instance?.assignedIp || "TBD"} icon={MapPin} />
                  <StatTile label="VPN" value={workspace.instance?.vpnConfig?.fileName ? "connected" : "offline"} icon={Lock} />
                  <StatTile label="Region" value={workspace.instance?.region || "asia-southeast-1"} icon={Users} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Live stats</p>
                <div className="mt-4 grid gap-3 text-sm text-cyber-muted">
                  <StatTile label="Active users" value={workspace.lab.activeUsers || 0} icon={Users} />
                  <StatTile label="XP earned" value={`${workspace.progress.xpEarned || 0}`} icon={Sparkles} />
<StatTile label="Session time" value={`${Math.floor((workspace.progress.timeSpent || 0) / 60)} min`} icon={Timer} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Flag submission</p>
                <h4 className="mt-2 text-xl font-black uppercase text-white">Stage proof</h4>
              </div>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">{workspace.progress.status?.replace(/_/g, " ") || "active"}</span>
            </div>
            <div className="mt-5 grid gap-4">
              <input
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter stage flag like UNI6{...}"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyber-red"
              />
              <Button variant="primary" onClick={handleSubmitFlag} className="w-full max-w-sm">
                <Flag className="h-4 w-4" /> Submit Flag
              </Button>
              {flagResult ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${flagResult.success ? "bg-emerald-500/10 text-emerald-200" : "bg-red-500/10 text-red-200"}`}>
                  {flagResult.message}
                </div>
              ) : null}
            </div>
          </div>

          <TerminalSimulator />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Hint economy</p>
                <h4 className="mt-2 text-xl font-black uppercase text-white">Stage hints</h4>
              </div>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">Costs XP</span>
            </div>
            <div className="mt-5 grid gap-3">
              {selectedHints.length ? selectedHints.map((hint) => {
                const unlocked = unlockedHintIds.includes(String(hint._id));
                return (
                  <div key={hint._id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-white">{hint.title || `Hint ${hint.level}`}</p>
                        <p className="mt-2 text-sm text-cyber-muted">{hint.level.replace(/_/g, " ")}</p>
                      </div>
                      <div className="text-right text-sm text-cyber-muted">
                        <p>{hint.cost} XP</p>
                        <p>{unlocked ? "Unlocked" : "Locked"}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-cyber-muted">{unlocked ? hint.content : "Unlock this hint to reveal the next clue."}</div>
                    {!unlocked ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleUnlockHint(hint._id)}
                        disabled={hintAction.loading}
                        className="mt-4 w-full"
                      >
                        Unlock Hint
                      </Button>
                    ) : null}
                  </div>
                );
              }) : (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-cyber-muted">No stage hints are configured yet. Progress to reveal guided support.</div>
              )}
            </div>
            {hintAction.message ? <p className="mt-4 text-sm text-cyber-red">{hintAction.message}</p> : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Field notes</p>
                <h4 className="mt-2 text-xl font-black uppercase text-white">Live note pad</h4>
              </div>
              <Clipboard className="h-5 w-5 text-cyber-red" />
            </div>
            <div className="mt-5 space-y-4">
              <input
                value={noteDraft.title}
                onChange={(e) => setNoteDraft((current) => ({ ...current, title: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
              />
              <textarea
                rows={6}
                value={noteDraft.content}
                onChange={(e) => setNoteDraft((current) => ({ ...current, content: e.target.value }))}
                placeholder="Write observations, commands, and payload notes here..."
                className="w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none resize-none"
              />
              <Button variant="primary" onClick={handleSaveNote} disabled={saveNoteLoading} className="w-full">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Objectives</h4>
          <ul className="mt-4 grid gap-3 text-sm text-cyber-muted">
            {(workspace.meta.objectives || lab.objectives || ["Follow stage guidance", "Collect evidence", "Submit proof"]).map((objective) => (
              <li key={objective} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{objective}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Active stages</h4>
          <div className="mt-4 space-y-3">
            {workspace.stages.map((stage) => (
              <button
                key={stage._id}
                type="button"
                onClick={() => setSelectedStageId(stage._id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${String(stage._id) === String(activeStage?._id) ? "border-cyber-red bg-cyber-red/10 text-white" : "border-white/10 bg-black/20 text-cyber-muted"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold uppercase tracking-[0.08em]">{stage.title}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-cyber-red">{stage.stageType.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 text-sm leading-6">{stage.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Downloads</h4>
          <div className="mt-4 space-y-3">
            {workspace.assets.length ? workspace.assets.map((asset) => (
              <a
                key={asset._id}
                href={asset.url}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted transition hover:border-cyber-red hover:text-white"
              >
                <div>
                  <p className="font-bold text-white">{asset.title}</p>
                  <p className="mt-1 text-xs">{asset.assetType.toUpperCase()} • {Math.round((asset.size || 0) / 1024)} KB</p>
                </div>
                <Download className="h-4 w-4" />
              </a>
            )) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted">No downloadable assets are available for this lab yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Live activity</h4>
          <ul className="mt-4 space-y-3 text-sm text-cyber-muted">
            {(activityLog.length ? activityLog : ["No recent lab events."]).map((event, index) => (
              <li key={`${event}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{event}</li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}

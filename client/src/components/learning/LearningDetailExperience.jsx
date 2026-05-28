"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flag,
  Lock,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { apiFetch } from "@/services/api";
import LabWorkspaceShell from "@/components/labs/LabWorkspaceShell";

function hasSubscription(user) {
  const plan = String(user?.subscriptionPlan || "free").toLowerCase();
  return ["premium", "pro", "enterprise"].includes(plan);
}

function PriceBadge({ item }) {
  if (!item?.premium) return <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-emerald-300">Free</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyber-red/40 bg-cyber-red/10 px-3 py-1 text-cyber-red">
      {item.offerPrice ? <strong>Rs {item.offerPrice}</strong> : null}
      <span className={item.offerPrice ? "text-white/40 line-through" : ""}>Rs {item.price || 0}</span>
      {item.offerPercentage ? <span className="rounded-full border border-cyber-red/40 bg-cyber-red/10 px-2 py-0.5 text-[10px] font-black text-cyber-red">{item.offerPercentage}% off</span> : null}
      {item.offer?.enabled ? <span className="text-cyber-muted">Limited offer</span> : null}
    </span>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-cyber-muted">
        <span>{label}</span>
        <Icon className="h-4 w-4 text-cyber-red" />
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function FeatureBadge({ children }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">{children}</span>;
}

export default function LearningDetailExperience({ item, type }) {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [liveUsers, setLiveUsers] = useState(Number(item?.activeUsers || item?.analytics?.activeUsers || 0));
  const [fullItem, setFullItem] = useState(item);
  const [loadingFull, setLoadingFull] = useState(false);
  const [entitled, setEntitled] = useState(!item?.premium);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [purchaseIntent, setPurchaseIntent] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState(null);
  const [labInstance, setLabInstance] = useState(null);
  const [instanceStatus, setInstanceStatus] = useState("inactive");
  const [instanceLoading, setInstanceLoading] = useState(false);
  const [instanceMessage, setInstanceMessage] = useState("");
  const [instanceAction, setInstanceAction] = useState("");

  const contentType = type.slice(0, -1);
  const details = useMemo(() => fullItem || item, [fullItem, item]);
  const activeUsers = details?.activeUsers || details?.analytics?.activeUsers || liveUsers;
  const completionRate = details?.completionStats?.completionRate || Math.round((Number(details?.completionStats?.completed || 0) / Math.max(1, Number(details?.completionStats?.started || 1))) * 100);
  const avgSolve = details?.analytics?.avgCompletionMinutes || details?.estimatedTime || 60;
  const trending = details?.analytics?.views > 1500 ? "Trending" : "Steady";

  useEffect(() => {
    if (!socket || !item?._id) return;
    socket.emit("learning:join", { scope: contentType, id: item._id });
    const onProgress = (payload) => {
      if (payload?.id === item._id && Number.isFinite(payload.activeUsers)) {
        setLiveUsers(payload.activeUsers);
      }
    };
    socket.on("learning:progress:update", onProgress);
    return () => {
      socket.emit("learning:leave", { scope: contentType, id: item._id });
      socket.off("learning:progress:update", onProgress);
    };
  }, [socket, item?._id, contentType]);

  useEffect(() => {
    let active = true;
    async function loadFull() {
      if (!item?._id || !isAuthenticated) return;
      setLoadingFull(true);
      try {
        const data = await apiFetch(`/learning/${type}/${item._id}/full`);
        if (!active) return;
        setFullItem(data.item);
        setEntitled(true);
      } catch (error) {
        if (!active) return;
        setEntitled(hasSubscription(user));
      } finally {
        if (!active) return;
        setLoadingFull(false);
      }
    }
    loadFull();
    return () => {
      active = false;
    };
  }, [isAuthenticated, item, type, user, contentType]);

  useEffect(() => {
    if (!item?._id || !entitled || contentType !== "lab") return;
    let active = true;

    async function refreshLabInstance() {
      try {
        const data = await apiFetch(`/labs/${item._id}/status`);
        if (!active) return;
        setLabInstance(data.instance || null);
        setInstanceStatus(data.status || (data.instance?._id ? "running" : "inactive"));
      } catch (error) {
        if (!active) return;
        setInstanceMessage(error.message || "Unable to load lab status.");
      }
    }

    refreshLabInstance();
    const interval = setInterval(refreshLabInstance, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [entitled, item?._id, contentType]);

  const locked = item?.premium && !entitled;
  const canAccess = !locked;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      await apiFetch(`/learning/${type}/${item._id}/enroll`, { method: "POST" });
      setAlertMessage("Lab enrollment updated. Environment is ready.");
      if (contentType === "lab") {
        await deployLab();
      }
    } catch (error) {
      setAlertMessage(error.message || "Enrollment failed.");
    }
  };

  const mutateLabInstance = async (route, body = {}) => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    if (!canAccess) {
      setCheckoutOpen(true);
      return;
    }

    setInstanceLoading(true);
    setInstanceAction(route.replace("/", ""));
    setInstanceMessage("");
    try {
      const data = await apiFetch(`/labs/${item._id}${route}`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      setLabInstance(data.instance || null);
      setInstanceStatus(data.instance?.status || "running");
      setInstanceMessage(data.message || "Lab instance updated.");
      return data;
    } catch (error) {
      setInstanceMessage(error.message || "Lab action failed.");
      throw error;
    } finally {
      setInstanceLoading(false);
      setInstanceAction("");
    }
  };

  const deployLab = () => mutateLabInstance("/deploy");
  const resetLab = () => mutateLabInstance("/reset");
  const terminateLab = () => mutateLabInstance("/terminate");
  const extendLab = () => mutateLabInstance("/extend", { extendHours: 24 });

  const handlePurchaseIntent = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    setCheckoutLoading(true);
    setCheckoutMessage("");
    try {
      const payload = await apiFetch("/learning/payments/intent", {
        method: "POST",
        body: JSON.stringify({
          itemType: contentType,
          itemId: item._id,
          amount: Number(details?.offerPrice || details?.price || 0),
          provider: "manual"
        })
      });
      setPurchaseIntent(payload.purchase);
      setCheckoutMessage("Review your order and confirm payment to unlock this lab instantly.");
    } catch (error) {
      setCheckoutMessage(error.message || "Unable to create checkout intent.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!purchaseIntent) return;
    setCheckoutLoading(true);
    try {
      const data = await apiFetch(`/learning/payments/${purchaseIntent._id}/confirm`, {
        method: "POST",
        body: JSON.stringify({ durationDays: 365 })
      });
      setEntitled(true);
      setAlertMessage("Premium access unlocked successfully.");
      setCheckoutOpen(false);
      setPurchaseIntent(data.purchase);
      if (contentType === "lab") {
        await handleEnroll();
      }
    } catch (error) {
      setCheckoutMessage(error.message || "Confirmation failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSubmitFlag = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    if (!flagInput.trim()) {
      setFlagResult({ success: false, message: "Enter a lab flag to validate." });
      return;
    }

    try {
      const data = await apiFetch(`/learning/${type}/${item._id}/flags`, {
        method: "POST",
        body: JSON.stringify({ flag: flagInput })
      });
      setFlagResult({ success: true, message: `Flag accepted! +${data.reward} XP` });
      setFlagInput("");
    } catch (error) {
      setFlagResult({ success: false, message: error.message || "Flag rejected." });
    }
  };

  const hintList = details?.hints || [];
  const flagList = details?.flags || [];
  const achievementList = details?.achievements || [];

  if (!item) {
    return <main className="mx-auto max-w-7xl px-4 py-16 text-white">Content not found.</main>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-7 shadow-[0_0_60px_rgba(255,0,60,0.18)]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${details.banner || details.thumbnail || "/images/default-lab-banner.jpg"})` }} />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">{contentType.toUpperCase()} LAB</p>
              <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.05em] text-white">{item.title}</h1>
              <p className="mt-3 max-w-3xl text-sm text-cyber-muted">{item.description || item.storyline || "Immersive cybersecurity missions with real-world relevance."}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FeatureBadge>{item.premium ? "Premium Tier" : "Open Access"}</FeatureBadge>
              <PriceBadge item={item} />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatItem icon={Users} label="Live Learners" value={activeUsers || "—"} />
            <StatItem icon={Clock3} label="Estimated Time" value={`${details?.estimatedTime || details?.duration || 60} min`} />
            <StatItem icon={Award} label="XP Reward" value={details?.xpReward || details?.points || 250} />
            <StatItem icon={Star} label="Completion Rate" value={`${completionRate}%`} />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Overview</p>
                <h2 className="mt-2 text-2xl font-black uppercase">Lab Experience</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">{item.category}</span>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">{item.difficulty}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-cyber-muted">Attack narrative, real-world relevance and the defensive context behind this mission.</p>
                <p className="mt-4 text-sm leading-7 text-white">{details?.fullDescription || details?.description}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-[0.12em] text-cyber-red">Attack simulation</p>
                <p className="mt-3 text-sm text-cyber-muted">{details?.attackSummary || details?.storyline || "Simulate an enterprise attack chain and collect evidence for remediation."}</p>
                <div className="mt-5 space-y-3">
                  {(details?.learningOutcomes || ["Exploit a realistic vulnerability", "Collect risk evidence", "Deliver remediation guidance"]).map((outcome) => (
                    <div key={outcome} className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-cyber-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyber-red" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_0.65fr]">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <h3 className="text-xl font-black uppercase tracking-[0.08em]">Learning Objectives</h3>
              <ul className="mt-4 grid gap-3 text-sm text-cyber-muted">
                {(details?.objectives?.length ? details.objectives : ["Exploit vulnerabilities", "Privilege escalation", "Lateral movement"]).map((objective) => (
                  <li key={objective} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">{objective}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <h3 className="text-xl font-black uppercase tracking-[0.08em]">Prerequisites</h3>
              <ul className="mt-4 grid gap-3 text-sm text-cyber-muted">
                {(details?.prerequisites?.length ? details.prerequisites : ["Linux basics", "Networking fundamentals", "HTTP knowledge"]).map((prerequisite) => (
                  <li key={prerequisite} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">{prerequisite}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Live telemetry</p>
                <h3 className="mt-2 text-2xl font-black uppercase">Realtime Lab Pulse</h3>
              </div>
              <span className="rounded-full border border-cyber-red/30 bg-cyber-red/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-red">{trending}</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatItem icon={Users} label="Active Learners" value={activeUsers || 0} />
              <StatItem icon={Sparkles} label="Completions Today" value={details?.analytics?.completions || 0} />
              <StatItem icon={Clock3} label="Avg Solve" value={`${avgSolve} min`} />
              <StatItem icon={ShieldCheck} label="Premium" value={item.premium ? "Yes" : "No"} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Lab environment</p>
                  <h3 className="mt-2 text-2xl font-black uppercase">Command & Control</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">Docker/K8s-ready architecture</span>
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-cyber-red">Instance status</p>
                      <p className="mt-2 text-lg font-black uppercase text-white">
                        {instanceStatus === "running" ? "Running" : instanceStatus === "deploying" ? "Deploying" : "Inactive"}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">
                      {labInstance?.provider || "Local Lab"}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm text-cyber-muted">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-cyber-red">Active session</p>
                      <p className="mt-2 text-white">{labInstance?._id ? "Provisioned" : "Not created"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-cyber-red">Created</p>
                      <p className="mt-2 text-white">{labInstance?.createdAt ? new Date(labInstance.createdAt).toLocaleString() : "N/A"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-cyber-red">Expires</p>
                      <p className="mt-2 text-white">{labInstance?.expiresAt ? new Date(labInstance.expiresAt).toLocaleString() : "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={deployLab}
                      disabled={!canAccess || instanceLoading}
                      className="rounded-2xl border border-cyber-red/40 bg-cyber-red/10 px-4 py-3 text-left text-sm text-white transition hover:bg-cyber-red/20 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {instanceLoading && instanceAction === "deploy" ? "Deploying lab…" : "Deploy Lab"}
                    </button>
                    <button
                      type="button"
                      onClick={resetLab}
                      disabled={!canAccess || instanceLoading || instanceStatus !== "running"}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white transition hover:border-cyber-red/40 hover:bg-black/30 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {instanceLoading && instanceAction === "reset" ? "Resetting…" : "Reset Lab"}
                    </button>
                    <button
                      type="button"
                      onClick={terminateLab}
                      disabled={!canAccess || instanceLoading || instanceStatus === "inactive"}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white transition hover:border-cyber-red/40 hover:bg-black/30 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {instanceLoading && instanceAction === "terminate" ? "Terminating…" : "Terminate Lab"}
                    </button>
                    <button
                      type="button"
                      onClick={extendLab}
                      disabled={!canAccess || instanceLoading || instanceStatus === "inactive"}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white transition hover:border-cyber-red/40 hover:bg-black/30 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {instanceLoading && instanceAction === "extend" ? "Extending…" : "Extend Lab"}
                    </button>
                    {instanceMessage ? (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {instanceMessage}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleEnroll}
                        disabled={!canAccess}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyber-red/40 bg-cyber-red/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-cyber-red transition hover:bg-cyber-red hover:text-white disabled:opacity-50"
                      >
                        <Terminal className="h-4 w-4" /> Start Lab
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.12em] text-white transition hover:border-cyber-red/40 hover:bg-black/40"
                      >
                        <ShieldCheck className="h-4 w-4 text-cyber-red" /> Unlock Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {contentType === "lab" && canAccess ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <LabWorkspaceShell lab={details} labInstance={labInstance} canAccess={canAccess} />
              </div>
            ) : null}

            <aside className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Hint system</p>
              <h3 className="mt-2 text-2xl font-black uppercase">Guided support</h3>
              <div className="mt-5 grid gap-3">
                {hintList.length ? hintList.map((hint, idx) => (
                  <div key={`${hint.title}-${idx}`} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-white">{hint.title || `Hint ${idx + 1}`}</p>
                      <span className="text-xs uppercase tracking-[0.1em] text-cyber-red">{hint.premium ? "Premium" : `XP ${hint.cost || 0}`}</span>
                    </div>
                    <p className="mt-2">{hint.content || "Access contextual guidance as you progress."}</p>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted">Hints are coming soon for this mission.</div>
                )}
              </div>
            </aside>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Flag verification</p>
                <h3 className="mt-2 text-2xl font-black uppercase">Submit Flag</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-muted">Retries OK</span>
            </div>
            <div className="mt-5 grid gap-3">
              <input
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter flag like UNI6{example}"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyber-red"
              />
              <button
                type="button"
                onClick={handleSubmitFlag}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyber-red px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-600"
              >
                <Flag className="h-4 w-4" /> Validate Flag
              </button>
              {flagResult ? (
                <div className={`rounded-xl px-4 py-3 text-sm ${flagResult.success ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                  {flagResult.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="text-xl font-black uppercase tracking-[0.08em]">Achievements</h3>
            <div className="mt-4 grid gap-3">
              {achievementList.length ? achievementList.map((achievement) => (
                <div key={achievement.title} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black uppercase tracking-[0.08em] text-white">{achievement.title}</p>
                      <p className="mt-2 text-sm text-cyber-muted">{achievement.description}</p>
                    </div>
                    <div className="rounded-full border border-cyber-red/40 bg-cyber-red/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyber-red">{achievement.points || 150} XP</div>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-cyber-muted">Complete this lab to unlock achievements like First Blood and Speed Runner.</div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Instructor</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5" />
              <div>
                <p className="text-base font-black text-white">{details?.instructor || details?.author || "UNI6CTF Labs"}</p>
                <p className="text-sm text-cyber-muted">Author · Cyber training specialist</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-cyber-muted">
              <p>Rating: {details?.rating || 4.7} / 5 ({details?.ratingCount || 120} reviews)</p>
              <p>Completed by {details?.completionStats?.completed || 0}+ learners.</p>
              <p>Premium access: {item.premium ? "Required" : "Open"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-cyber-red">Subscription</h3>
            <div className="mt-4 space-y-3 text-sm text-cyber-muted">
              <p>Free plan: public labs only</p>
              <p>Premium plan: unlock advanced labs, rooms, workshops and certificates</p>
              <p>Elite plan: all-access, mentor sessions, live rooms and enterprise teams</p>
            </div>
            <Link href="/dashboard/subscriptions" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyber-red px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-600">
              Manage Plan
            </Link>
          </div>

          {alertMessage ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{alertMessage}</div>
          ) : null}
        </aside>
      </section>

      {checkoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-black/95 p-6 text-white shadow-[0_0_60px_rgba(255,0,60,0.2)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Unlock flow</p>
                <h2 className="mt-2 text-2xl font-black uppercase">Premium Purchase</h2>
              </div>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="text-cyber-muted">Close</button>
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-cyber-muted">
              <p className="font-bold text-white">{item.title}</p>
              <p className="mt-2">{item.category} · {item.difficulty} · {item.premium ? "Premium" : "Free"}</p>
              <p className="mt-3">Order total: {details?.offerPrice ? `Rs ${details.offerPrice}` : `Rs ${details.price || 0}`}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyber-red">GST and offers handled at checkout</p>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm uppercase tracking-[0.12em] text-cyber-red">Payment methods</p>
                <div className="mt-3 grid gap-2 text-sm text-cyber-muted">
                  <span>Stripe-ready architecture</span>
                  <span>Razorpay / UPI / Paytm (India)</span>
                  <span>PayPal-ready integration</span>
                </div>
              </div>
              <button
                type="button"
                onClick={purchaseIntent ? handleConfirmPurchase : handlePurchaseIntent}
                disabled={checkoutLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-cyber-red px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {checkoutLoading ? "Processing..." : purchaseIntent ? "Confirm Payment" : "Create Payment Intent"}
              </button>
              {checkoutMessage ? <p className="text-sm text-cyber-muted">{checkoutMessage}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

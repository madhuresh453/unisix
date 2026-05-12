"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_LABELS = {
  upcoming: "Starts In",
  live: "Ends In",
  past: "Event Ended",
};

const STATUS_BADGES = {
  upcoming: "Upcoming",
  live: "Live",
  past: "Completed",
};

function parseDateValue(value) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return NaN;
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const fallback = new Date(value).getTime();
  return Number.isNaN(fallback) ? NaN : fallback;
}

function getPhase(startDate, endDate) {
  const startMillis = parseDateValue(startDate);
  const endMillis = parseDateValue(endDate);
  const now = Date.now();

  if (Number.isNaN(startMillis) || Number.isNaN(endMillis)) {
    return {
      phase: "upcoming",
      label: STATUS_LABELS.upcoming,
      targetDate: now,
    };
  }

  if (now >= endMillis) {
    return {
      phase: "past",
      label: STATUS_LABELS.past,
      targetDate: endMillis,
    };
  }

  if (now >= startMillis) {
    return {
      phase: "live",
      label: STATUS_LABELS.live,
      targetDate: endMillis,
    };
  }

  return {
    phase: "upcoming",
    label: STATUS_LABELS.upcoming,
    targetDate: startMillis,
  };
}

function getCountdownParts(targetDate) {
  const targetMillis = parseDateValue(targetDate);
  if (Number.isNaN(targetMillis)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const delta = Math.max(targetMillis - Date.now(), 0);
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function CountdownTimer({ startDate, endDate, status }) {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mounted]);

  const phase = useMemo(
    () => {
      const phaseData = getPhase(startDate, endDate);
      const normalizedPhase = phaseData.phase;
      return {
        ...phaseData,
        badge: STATUS_BADGES[normalizedPhase] || (status ? status.toUpperCase() : "Upcoming"),
      };
    },
    [startDate, endDate, status, tick],
  );

  const countdown = useMemo(
    () => getCountdownParts(phase.targetDate),
    [phase.targetDate, tick],
  );

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <div className="rounded-[32px] border border-white/10 bg-[#08090f]/95 p-5 shadow-[0_30px_90px_rgba(255,0,60,0.14)]">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd61f]">
              Loading...
            </p>
            <p className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
              {STATUS_BADGES[getPhase(startDate, endDate).phase] || "Upcoming"}
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
            <div
              key={label}
              className="rounded-[28px] border border-[#ff1f45]/15 bg-[#06070b]/95 p-4 text-center shadow-[0_0_35px_rgba(255,0,60,0.12)]"
            >
              <p className="text-4xl font-black uppercase tracking-[-0.03em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] tabular-nums">
                00
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyber-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#08090f]/95 p-5 shadow-[0_30px_90px_rgba(255,0,60,0.14)]">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd61f]">
            {phase.label}
          </p>
          <p className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
            {phase.badge}
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-[#ff1f45]/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 shadow-[0_0_30px_rgba(255,31,69,0.12)]">
          {status ? status.toUpperCase() : phase.badge}
        </span>
      </div>

      {phase.phase === "past" ? (
        <div className="rounded-[28px] border border-[#ff1f45]/20 bg-[#120009]/95 p-8 text-center text-white shadow-[0_0_35px_rgba(255,0,60,0.16)]">
          <p className="text-xl font-semibold uppercase tracking-[0.24em] text-[#ff5f7e]">
            Event Ended
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/60">
            See completed event details and archives.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Minutes", value: countdown.minutes },
            { label: "Seconds", value: countdown.seconds },
          ].map((block) => (
            <div
              key={block.label}
              className="rounded-[28px] border border-[#ff1f45]/15 bg-[#06070b]/95 p-4 text-center shadow-[0_0_35px_rgba(255,0,60,0.12)] transition duration-200 hover:shadow-[0_0_45px_rgba(255,0,60,0.20)]"
            >
              <p className="text-4xl font-black uppercase tracking-[-0.03em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)] tabular-nums">
                {pad(block.value)}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyber-muted">
                {block.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

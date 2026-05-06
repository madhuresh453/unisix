"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCountdownParts } from "@/utils/formatters";

export function Countdown({ targetDate }) {
  const [parts, setParts] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setParts(getCountdownParts(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {Object.entries(parts).map(([label, value], index) => (
        <motion.div
          key={label}
          className="rounded-xl border border-white/10 bg-[#090a0d]/90 p-3 text-center transition duration-200 hover:border-cyber-red/50 hover:bg-[#111113]/90"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-2xl font-black tabular-nums text-white">{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyber-muted">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export function MotionSection({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

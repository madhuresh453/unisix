import React from "react";

export default function SectionHeading({ label, title, description, className }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff1f45]">{label}</p>
      <h2 className="mt-3 font-teko text-4xl uppercase tracking-[0.02em] text-white sm:text-5xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{description}</p> : null}
    </div>
  );
}

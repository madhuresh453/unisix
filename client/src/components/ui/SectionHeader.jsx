import { Badge } from "./Badge";

export function SectionHeader({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={align === "center" ? "w-full text-center" : "w-full"}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight md:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-base leading-7 text-cyber-muted md:text-lg">{body}</p> : null}
    </div>
  );
}

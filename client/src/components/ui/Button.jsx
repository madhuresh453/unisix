import Link from "next/link";
import { cn } from "@/utils/helpers";

const variants = {
  primary: "border border-cyber-red bg-cyber-red text-white shadow-glow hover:bg-red-500 hover:shadow-glow-strong",
  secondary: "border border-white/20 bg-white/[0.02] text-white backdrop-blur hover:border-cyber-red/70 hover:bg-white/[0.04] hover:shadow-glow-card",
  ghost: "text-cyber-muted hover:text-white"
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 ease-out hover:-translate-y-0.5",
    variants[variant],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
      {Icon && iconPosition === "right" ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}

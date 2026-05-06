import { cn } from "@/utils/helpers";

export function Input({ className = "", as = "input", children, ...props }) {
  const Component = as;
  const classes = cn(
    "focus-ring min-h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-cyber-muted hover:border-white/20 focus:border-cyber-red/70 focus:bg-black/50 focus:shadow-glow",
    as === "textarea" ? "min-h-36 py-3 leading-6" : "",
    className
  );

  if (as === "input") {
    return <input className={classes} {...props} />;
  }

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

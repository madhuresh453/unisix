import { cn } from "@/utils/helpers";

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-[#090a0d]/80 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

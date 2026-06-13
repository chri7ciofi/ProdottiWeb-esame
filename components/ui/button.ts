import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 active:translate-y-px disabled:opacity-60",
  secondary:
    "border border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50 active:translate-y-px",
  ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
  danger:
    "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 active:translate-y-px",
};

/** Classi condivise per bottoni e link che sembrano bottoni. */
export function btn(variant: Variant = "primary", className?: string): string {
  return cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed",
    VARIANTS[variant],
    className
  );
}

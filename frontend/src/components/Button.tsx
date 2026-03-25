import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

const variants = {
  primary:
    "bg-panel-900 text-ink-900 hover:bg-sand-200 shadow-soft border border-white/10",
  ghost:
    "bg-transparent text-ink-500 hover:text-ink-900 hover:bg-white/10 border border-transparent",
  outline:
    "bg-transparent text-ink-900 border border-white/20 hover:bg-white/10",
  danger: "bg-ember-500 text-sand-50 hover:bg-ember-600 border border-ember-600",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "motion-button inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-2 text-sm font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-ember-500/40",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

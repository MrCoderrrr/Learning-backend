import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-ink-700">
      {label && <span className="text-ink-700">{label}</span>}
      <input
        className={cn(
          "rounded-[16px] border border-white/10 bg-panel-900 px-4 py-3 text-base text-ink-900 shadow-sm",
          "placeholder:text-ink-500 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-accent-purple/30",
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs text-ink-500">{hint}</span>}
    </label>
  );
}

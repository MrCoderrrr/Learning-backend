import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel motion-card rounded-[16px] p-6 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

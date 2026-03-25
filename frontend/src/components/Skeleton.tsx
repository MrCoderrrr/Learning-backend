import { cn } from "../lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-full animate-pulse rounded-full bg-sand-200",
        className
      )}
    />
  );
}

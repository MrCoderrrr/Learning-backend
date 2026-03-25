import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./Button";

export function Modal({
  open,
  title,
  onClose,
  children,
  actions,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4">
      <div className={cn("glass-panel w-full max-w-xl rounded-3xl p-6")}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold text-ink-900">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-4 text-ink-500">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}

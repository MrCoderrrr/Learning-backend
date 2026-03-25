import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../lib/utils";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
};

type ToastContextValue = {
  push: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneStyles: Record<
  NonNullable<ToastItem["tone"]>,
  {
    label: string;
    wrapper: string;
    badge: string;
    title: string;
    description: string;
  }
> = {
  success: {
    label: "Success",
    wrapper:
      "border border-moss-500/35 bg-[linear-gradient(135deg,rgba(34,197,94,0.18),rgba(16,16,16,0.96))] shadow-[0_24px_60px_-32px_rgba(34,197,94,0.45)]",
    badge: "bg-moss-500/18 text-moss-500 ring-1 ring-moss-500/30",
    title: "text-white",
    description: "text-emerald-50/85",
  },
  error: {
    label: "Error",
    wrapper:
      "border border-ember-500/40 bg-[linear-gradient(135deg,rgba(239,68,68,0.2),rgba(16,16,16,0.97))] shadow-[0_24px_60px_-32px_rgba(239,68,68,0.45)]",
    badge: "bg-ember-500/18 text-ember-500 ring-1 ring-ember-500/35",
    title: "text-white",
    description: "text-rose-50/85",
  },
  info: {
    label: "Notice",
    wrapper:
      "border border-accent-cyan/35 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(16,16,16,0.96))] shadow-[0_24px_60px_-32px_rgba(34,211,238,0.42)]",
    badge: "bg-accent-cyan/18 text-accent-cyan ring-1 ring-accent-cyan/35",
    title: "text-white",
    description: "text-cyan-50/85",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = (toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-3 top-3 z-50 flex w-[min(92vw,25rem)] flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => {
          const tone = toast.tone ?? "info";
          const theme = toneStyles[tone];

          return (
            <div
              key={toast.id}
              className={cn(
                "glass-panel w-full rounded-[22px] px-5 py-4 text-base shadow-soft backdrop-blur-xl",
                theme.wrapper
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                    theme.badge
                  )}
                >
                  {theme.label}
                </span>
              </div>
              <p className={cn("text-base font-semibold leading-6 sm:text-lg", theme.title)}>
                {toast.title}
              </p>
              {toast.description && (
                <p
                  className={cn(
                    "mt-2 text-sm leading-6 sm:text-[15px]",
                    theme.description
                  )}
                >
                  {toast.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

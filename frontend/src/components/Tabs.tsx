import { cn } from "../lib/utils";

export type TabItem = {
  value: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            value === tab.value
              ? "border-ink-900 bg-ink-900 text-sand-50"
              : "border-white/10 bg-panel-900 text-ink-700 hover:border-white/25"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="surface-box-soft flex flex-col items-start gap-3 rounded-[16px] border border-dashed p-6">
      <h3 className="text-xl font-semibold text-ink-900">{title}</h3>
      {description && <p className="text-ink-500">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

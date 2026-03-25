import clsx from "clsx";

export function cn(...values: Array<string | undefined | null | false>) {
  return clsx(values);
}

export function formatNumber(value?: number) {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

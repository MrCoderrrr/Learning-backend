import { useMemo } from "react";
import { cn } from "../lib/utils";

export function MediaUploader({
  label,
  file,
  currentImage,
  currentLabel,
  accept,
  onChange,
  className,
}: {
  label: string;
  file?: File | null;
  currentImage?: string;
  currentLabel?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  className?: string;
}) {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-sm font-medium text-ink-700">{label}</label>
      <div className="surface-box-soft flex flex-col gap-3 rounded-[16px] border border-dashed p-4">
        <input
          key={file ? file.name : "empty"}
          type="file"
          accept={accept}
          className="file-input"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
        {!previewUrl && currentImage && !accept?.includes("video") && (
          <div className="surface-media overflow-hidden rounded-[16px]">
            <img
              src={currentImage}
              alt={currentLabel ?? label}
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        {previewUrl && (
          <div className="surface-media overflow-hidden rounded-[16px]">
            {accept?.includes("video") ? (
              <video
                src={previewUrl}
                controls
                className="h-48 w-full object-cover"
              />
            ) : (
              <img src={previewUrl} className="h-48 w-full object-cover" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

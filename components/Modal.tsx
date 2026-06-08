"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// シンプルなモーダル（拡大表示用）。ESC/背景クリックで閉じる。
export function Modal({
  open,
  onClose,
  title,
  panelClassName,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  panelClassName?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 max-h-[90vh] w-full overflow-auto rounded-xl border bg-background p-5 shadow-xl",
          panelClassName ?? "max-w-3xl",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="ml-auto rounded-md border px-2 py-1 text-sm hover:bg-muted"
          >
            ✕ 閉じる
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

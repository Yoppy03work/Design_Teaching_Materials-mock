"use client";

import { CVD_TYPES, type CvdType } from "@/lib/colorblind";
import { cn } from "@/lib/utils";

// 色覚シミュレーションの操作パネル（型・程度・表示切替）。
export function CvdControls({
  type,
  severity,
  showSim,
  onType,
  onSeverity,
  onShowSim,
}: {
  type: CvdType;
  severity: number;
  showSim: boolean;
  onType: (t: CvdType) => void;
  onSeverity: (s: number) => void;
  onShowSim: (b: boolean) => void;
}) {
  const pct = Math.round(severity * 100);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">型：</span>
        {CVD_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={type === t.key}
            onClick={() => onType(t.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              type === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
        <span className="text-sm text-muted-foreground">
          {CVD_TYPES.find((t) => t.key === type)?.note}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="cvd-severity" className="text-sm font-medium">
          程度（Machado 2009）：{pct}%
        </label>
        <input
          id="cvd-severity"
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={severity}
          onChange={(e) => onSeverity(parseFloat(e.target.value))}
          className="w-48"
        />
        <span className="text-xs text-muted-foreground">
          0%＝健常者 〜 100%＝完全二色覚
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">表示：</span>
        <button
          type="button"
          aria-pressed={!showSim}
          onClick={() => onShowSim(false)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm",
            !showSim
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          自分の見え方（原画）
        </button>
        <button
          type="button"
          aria-pressed={showSim}
          onClick={() => onShowSim(true)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm",
            showSim
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          他者（祖父）の見え方
        </button>
      </div>
    </div>
  );
}

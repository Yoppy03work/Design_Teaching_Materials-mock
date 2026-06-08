import type { DesignData } from "@/lib/types";
import {
  contrastRatio,
  designContrastPairs,
  wcagRating,
  type WcagRating,
} from "@/lib/wcag";
import { cn } from "@/lib/utils";

const RATING_META: Record<WcagRating, { label: string; className: string }> = {
  AAA: {
    label: "AAA",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  AA: {
    label: "AA",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  "AA-Large": {
    label: "大字AA",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  Fail: {
    label: "失格",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
};

// 各色ペアのコントラスト比と WCAG 等級バッジを表示する（配色変更で即時に再計算）。
export function ContrastChecker({ design }: { design: DesignData }) {
  const pairs = designContrastPairs(design);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">WCAG コントラスト比</p>
      <ul className="space-y-1.5">
        {pairs.map((pair) => {
          const ratio = contrastRatio(pair.fg, pair.bg);
          const meta = RATING_META[wcagRating(ratio)];
          return (
            <li
              key={pair.label}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex gap-1" aria-hidden>
                  <span
                    className="size-4 rounded-sm border"
                    style={{ backgroundColor: pair.bg }}
                  />
                  <span
                    className="size-4 rounded-sm border"
                    style={{ backgroundColor: pair.fg }}
                  />
                </span>
                {pair.label}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {Number.isNaN(ratio) ? "—" : `${ratio.toFixed(2)}:1`}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    meta.className,
                  )}
                >
                  {meta.label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

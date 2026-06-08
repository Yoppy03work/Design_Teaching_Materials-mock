"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/steps";
import { useProgress } from "@/components/ProgressProvider";
import { cn } from "@/lib/utils";

export function ProgressBar() {
  const { completed, isCompleted, loading } = useProgress();
  const pathname = usePathname();
  const total = STEPS.length;
  const doneCount = completed.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">学習の進捗</span>
        <span className="text-muted-foreground">
          {loading ? "…" : `${doneCount} / ${total} 完了`}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="学習の進捗"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <nav aria-label="ステップナビゲーション" className="flex flex-wrap gap-1.5">
        {STEPS.map((s) => {
          const active = pathname === `/lesson/step/${s.id}`;
          const done = isCompleted(s.id);
          return (
            <Link
              key={s.id}
              href={`/lesson/step/${s.id}`}
              aria-current={active ? "step" : undefined}
              title={`STEP${s.order} ${s.title}`}
              className={cn(
                "flex size-8 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                active && "ring-2 ring-primary/40",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {done ? "✓" : s.order}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

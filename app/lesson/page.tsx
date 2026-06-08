"use client";

import Link from "next/link";
import { STEPS } from "@/lib/steps";
import { useProgress } from "@/components/ProgressProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 学習フローの一覧と「続きから」。各ステップへ遷移できる。
export default function LessonOverviewPage() {
  const { isCompleted, completed, persisted, loading } = useProgress();
  const firstIncomplete =
    STEPS.find((s) => !isCompleted(s.id)) ?? STEPS[STEPS.length - 1];
  const started = completed.size > 0;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">学習の流れ</h2>
        <p className="text-muted-foreground">
          祖父（68歳・色覚多様性・老眼）のためのアルバムサイトの配色を、動画 →
          演習 → ライブラリ → 振り返り の順に非同期で進めます。
        </p>
        {loading ? (
          <span
            className={cn(
              buttonVariants({ size: "lg" }),
              "pointer-events-none opacity-60",
            )}
            aria-disabled="true"
          >
            読み込み中…
          </span>
        ) : (
          <Link
            href={`/lesson/step/${firstIncomplete.id}`}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {started ? `続きから（STEP ${firstIncomplete.order}）` : "はじめる"}
          </Link>
        )}
      </section>

      <ol className="space-y-3">
        {STEPS.map((step) => {
          const done = isCompleted(step.id);
          return (
            <li key={step.id}>
              <Link
                href={`/lesson/step/${step.id}`}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {done ? "✓" : step.order}
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.summary}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {!loading && !persisted && (
        <p className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
          進捗の永続化が無効です（Supabase 未接続、または接続に失敗）。このセッション内のみ保持され、リロードで消えます。永続化するには
          <code className="mx-1">.env.local</code>
          に Supabase の接続情報を設定してください。
        </p>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STEPS, type StepMeta } from "@/lib/steps";
import { useProgress } from "@/components/ProgressProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StepView({ step }: { step: StepMeta }) {
  const { isCompleted, markCompleted } = useProgress();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const done = isCompleted(step.id);
  const prev = STEPS.find((s) => s.order === step.order - 1);
  const next = STEPS.find((s) => s.order === step.order + 1);

  async function handleComplete() {
    setSaving(true);
    await markCompleted(step.id);
    setSaving(false);
    router.push(next ? `/lesson/step/${next.id}` : "/lesson");
  }

  return (
    <article className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          STEP {step.order} / {STEPS.length}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
        <p className="text-muted-foreground">{step.summary}</p>
      </div>

      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        このステップの操作画面は今後のフェーズで実装します（プレースホルダ）。
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link
          href={prev ? `/lesson/step/${prev.id}` : "/lesson"}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {prev ? "← 前へ" : "← 一覧へ"}
        </Link>
        <div className="flex items-center gap-3">
          {done && <span className="text-sm text-green-600">✓ 完了済み</span>}
          <Button onClick={handleComplete} disabled={saving}>
            {saving ? "保存中…" : next ? "完了して次へ →" : "完了する"}
          </Button>
        </div>
      </div>
    </article>
  );
}

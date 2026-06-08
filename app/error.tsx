"use client";

import { Button } from "@/components/ui/button";

// グローバルエラーバウンダリ。
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold">エラーが発生しました</h1>
      <p className="text-sm text-muted-foreground">
        時間をおいて再度お試しください。問題が続く場合は先生に知らせてください。
      </p>
      <Button onClick={reset}>再読み込み</Button>
    </div>
  );
}

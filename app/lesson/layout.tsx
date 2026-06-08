import type { ReactNode } from "react";

// レッスン共通レイアウト。Phase 1 で進捗バー＋ステップナビを追加する。
export default function LessonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <p className="text-sm text-muted-foreground">
            情報I ・ コミュニケーションと情報デザイン
          </p>
          <h1 className="text-lg font-semibold">アクセシブルなデザイン</h1>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ProgressProvider } from "@/components/ProgressProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { PersistenceNotice } from "@/components/PersistenceNotice";
import { WorksProvider } from "@/components/WorksProvider";

// レッスン共通レイアウト：進捗の状態を供給し、ヘッダーに進捗バー＋ステップナビを表示する。
export default function LessonLayout({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      <WorksProvider>
        <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground">
                情報I ・ コミュニケーションと情報デザイン
              </p>
              <Link
                href="/lesson"
                className="text-lg font-semibold hover:underline"
              >
                アクセシブルなデザイン
              </Link>
            </div>
            <ProgressBar />
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">
          <PersistenceNotice />
          {children}
        </main>
        </div>
      </WorksProvider>
    </ProgressProvider>
  );
}

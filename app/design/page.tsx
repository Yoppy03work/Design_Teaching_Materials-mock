"use client";

import Link from "next/link";
import { WorksProvider } from "@/components/WorksProvider";
import { WorkSubmitForm } from "@/components/WorkSubmitForm";
import { AIAssistant } from "@/components/AIAssistant";
import { PrivacyNote } from "@/components/PrivacyNote";

// 配色エディタを全幅で開く独立ページ。STEP5 のボタンから遷移し、
// 大きいプレビューで設計・AI壁打ち・提出を行う。提出後はレッスンに戻る。
export default function DesignPage() {
  return (
    <WorksProvider>
      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <header className="space-y-1">
          <p className="text-sm">
            <Link
              href="/lesson/step/step5"
              className="text-muted-foreground underline underline-offset-4 hover:no-underline"
            >
              ← レッスンに戻る
            </Link>
          </p>
          <h1 className="text-2xl font-bold">配色エディタ</h1>
          <p className="text-sm text-muted-foreground">
            祖父のためのアルバムサイトの配色を、大きい画面で設計しましょう。提出したらレッスンに戻って「完了して次へ」を押してください。
          </p>
        </header>

        <PrivacyNote />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">配色を設計して提出</h2>
          <WorkSubmitForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">AIに相談（壁打ち）</h2>
          <AIAssistant />
        </section>
      </main>
    </WorksProvider>
  );
}

import { STEPS } from "@/lib/steps";

// 学習フローの一覧（STEP1〜7）。
// Phase 0 はこの概要表示まで。各ステップの中身とルーティングは Phase 1 以降で実装する。
export default function LessonOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">学習の流れ</h2>
        <p className="text-muted-foreground">
          祖父（68歳・色覚多様性・老眼）のためのアルバムサイトの配色を、動画 →
          演習 → ライブラリ → 振り返り の順に非同期で進めます。
        </p>
      </section>

      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li
            key={step.id}
            className="flex items-start gap-4 rounded-lg border p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {step.order}
            </span>
            <div className="space-y-0.5">
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.summary}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        現在のセットアップ: 認証は後回し（固定のデモユーザーで進行）。各ステップの操作画面は次のフェーズで追加します。
      </p>
    </div>
  );
}

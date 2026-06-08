import { WorksProvider } from "@/components/WorksProvider";
import { WorkSubmitForm } from "@/components/WorkSubmitForm";
import { WorkGallery } from "@/components/WorkGallery";

// 開発プレビュー（Phase 5）。提出フローと作品ライブラリの単体確認用。
// Phase 5/6 で STEP5(提出)・STEP6(ライブラリ閲覧) に組み込む。
export default function GalleryLabPage() {
  return (
    <WorksProvider>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        <header className="space-y-1">
          <p className="text-sm text-muted-foreground">開発プレビュー（Phase 5）</p>
          <h1 className="text-2xl font-bold tracking-tight">作品ライブラリ＋提出</h1>
          <p className="text-muted-foreground">
            配色を設計して提出し、サンプル作品を閲覧・コメントできます。Supabase
            未接続時はサンプル表示＋セッション内保存で動作します。
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">配色を設計して提出</h2>
          <WorkSubmitForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">作品ライブラリ</h2>
          <WorkGallery filter="all" />
        </section>
      </div>
    </WorksProvider>
  );
}

import { ColorEditor } from "@/components/ColorEditor";

// 開発プレビュー（Phase 2）。配色エディタ＋WCAGの単体確認用。
// Phase 5 で STEP5 の演習に組み込む。
export default function ColorEditorLabPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">開発プレビュー（Phase 2）</p>
        <h1 className="text-2xl font-bold tracking-tight">
          配色エディタ ＋ WCAG コントラスト
        </h1>
        <p className="text-muted-foreground">
          プリセットを改変し、祖父のアルバムサイトの配色を設計します。コントラスト比はリアルタイムで判定されます。
        </p>
      </header>
      <ColorEditor />
    </div>
  );
}

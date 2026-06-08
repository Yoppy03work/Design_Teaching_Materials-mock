import { ColorBlindSimulator } from "@/components/ColorBlindSimulator";

// 開発プレビュー（Phase 3）。色覚シミュレータの単体確認用。
// Phase 5 で STEP3 の演習に組み込む。
export default function CvdLabPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">開発プレビュー（Phase 3）</p>
        <h1 className="text-2xl font-bold tracking-tight">
          色覚シミュレータ（Machado 2009 ＋ Brettel 1997）
        </h1>
        <p className="text-muted-foreground">
          祖父（赤緑色弱）の見え方を体験します。型と程度を変え、「自分の見え方」と「他者の見え方」を切り替えてください。
        </p>
      </header>
      <ColorBlindSimulator />
    </div>
  );
}

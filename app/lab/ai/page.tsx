import { AIAssistant } from "@/components/AIAssistant";

// 開発プレビュー（Phase 4）。AI壁打ちの単体確認用。
// Phase 5 で STEP5 の演習に組み込む。
export default function AiLabPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">開発プレビュー（Phase 4）</p>
        <h1 className="text-2xl font-bold tracking-tight">AI壁打ち（Claude Haiku）</h1>
        <p className="text-muted-foreground">
          配色設計の相談相手です。答えは出さず、祖父の視点で考えるための問いを返します。
          <code className="mx-1">ANTHROPIC_API_KEY</code>
          未設定時は利用不可メッセージが返ります。
        </p>
      </header>
      <AIAssistant />
    </div>
  );
}

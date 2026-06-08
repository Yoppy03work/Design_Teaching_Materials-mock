import { ReflectionForm } from "@/components/ReflectionForm";

// 開発プレビュー（Phase 6）。振り返り3問の確認用。
export default function ReflectionLabPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">開発プレビュー（Phase 6）</p>
        <h1 className="text-2xl font-bold tracking-tight">振り返り（3問）</h1>
        <p className="text-muted-foreground">
          書き出しヒント付きの3問。Supabase未接続時はこのセッション内のみ保持します。
        </p>
      </header>
      <ReflectionForm />
    </div>
  );
}

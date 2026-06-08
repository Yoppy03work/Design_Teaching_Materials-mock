"use client";

import { useProgress } from "@/components/ProgressProvider";

// 進捗が永続化されていない（Supabase 未接続／読み書き失敗）ときに、
// 一覧だけでなく全レッスンページで警告を表示する。
export function PersistenceNotice() {
  const { loading, persisted } = useProgress();
  if (loading || persisted) return null;
  return (
    <p className="mb-6 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
      進捗の永続化が無効です（Supabase 未接続、または接続に失敗）。このセッション内のみ保持され、リロードで消えます。永続化するには
      <code className="mx-1">.env.local</code>
      に Supabase の接続情報を設定してください。
    </p>
  );
}

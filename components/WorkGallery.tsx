"use client";

import { useWorks } from "@/components/WorksProvider";
import { WorkCard } from "@/components/WorkCard";
import type { WorkFilter } from "@/lib/repo/works";

// 作品ライブラリ。filter='sample'=サンプルのみ / 'public'=公開された生徒作品 / 'all'=全作品。
export function WorkGallery({ filter = "sample" }: { filter?: WorkFilter }) {
  const { works, commentsByWork, loading, addComment } = useWorks();
  const shown =
    filter === "sample"
      ? works.filter((w) => w.type === "sample")
      : filter === "public"
        ? works.filter((w) => w.type === "student" && w.is_public)
        : works;

  if (loading) {
    return <p className="text-sm text-muted-foreground">読み込み中…</p>;
  }
  if (shown.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {filter === "public"
          ? "まだ公開された作品がありません。提出時に「作品ライブラリに公開する」にチェックすると、ここに表示されます。"
          : "作品がまだありません。"}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {shown.map((w) => (
        <WorkCard
          key={w.id}
          work={w}
          comments={commentsByWork[w.id] ?? []}
          onAddComment={(content) => addComment(w.id, content)}
        />
      ))}
    </div>
  );
}

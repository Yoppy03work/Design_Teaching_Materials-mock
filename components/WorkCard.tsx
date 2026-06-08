"use client";

import { useState } from "react";
import Link from "next/link";
import type { Comment, Philosophy, Work } from "@/lib/types";
import { wcagRating } from "@/lib/wcag";
import { normalizeDesign } from "@/lib/design";
import { Button } from "@/components/ui/button";

const PHILOSOPHY_LABEL: Record<Philosophy, string> = {
  function: "機能優先",
  emotion: "感情優先",
  dialogue: "対話優先",
};

const RATING_LABEL = {
  AAA: "AAA",
  AA: "AA",
  "AA-Large": "大字AA",
  Fail: "要改善",
} as const;

export function WorkCard({
  work,
  comments,
  onAddComment,
}: {
  work: Work;
  comments: Comment[];
  onAddComment: (content: string) => void;
}) {
  const [comment, setComment] = useState("");
  const d = normalizeDesign(work.design_data);
  const rating = work.wcag_score != null ? wcagRating(work.wcag_score) : "Fail";

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Link
        href={`/works/${work.id}`}
        aria-label="この作品の配色でつくったページを開く"
        className="block overflow-hidden rounded-md border transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: d.bg, color: d.text }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 text-sm font-semibold"
          style={{ backgroundColor: d.surface }}
        >
          <span style={{ color: d.heading }}>家族のアルバム</span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: d.accent, color: d.bg }}
          >
            NEW
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 pb-3">
          <span
            className="inline-block rounded px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: d.button, color: d.buttonText }}
          >
            写真を追加
          </span>
          <span className="ml-auto flex gap-1" aria-hidden>
            {[d.tag1, d.tag2, d.tag3].map((c, i) => (
              <span
                key={i}
                className="size-3 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </span>
        </div>
      </Link>
      <p className="text-xs text-muted-foreground">
        クリックでこの配色のページを開く →
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {work.type === "sample" && work.philosophy && (
          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
            {PHILOSOPHY_LABEL[work.philosophy]}
          </span>
        )}
        {work.type === "student" && (
          <span className="rounded-full bg-muted px-2 py-0.5">生徒作品</span>
        )}
        {work.wcag_score != null && (
          <span className="text-muted-foreground">
            最小コントラスト {work.wcag_score.toFixed(2)}:1（{RATING_LABEL[rating]}）
          </span>
        )}
        <span className="text-muted-foreground">文字 {d.fontSize}px</span>
      </div>

      {work.intent_memo && <p className="text-sm">{work.intent_memo}</p>}

      <div className="space-y-2 border-t pt-3">
        <p className="text-xs font-medium text-muted-foreground">
          コメント（{comments.length}）
        </p>
        {comments.map((c) => (
          <p key={c.id} className="rounded bg-muted px-2 py-1 text-sm">
            {c.content}
          </p>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const t = comment.trim();
            if (!t) return;
            onAddComment(t);
            setComment("");
          }}
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="コメントを書く"
            aria-label="コメント"
            className="flex-1 rounded-md border bg-background px-2 py-1 text-sm"
          />
          <Button type="submit" size="sm" variant="outline" disabled={!comment.trim()}>
            送信
          </Button>
        </form>
      </div>
    </div>
  );
}

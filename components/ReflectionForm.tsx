"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getReflection, saveReflection } from "@/lib/repo/reflections";
import { Button } from "@/components/ui/button";

// 仕様書 §5.6：書き出しヒント付きの3問。
const LABELS = [
  "(1) 色覚シミュレータを体験して気づいたこと",
  "(2) 自分の配色で優先したことと、その理由",
  "(3) 次に誰のために設計したいか",
];
const HINTS = [
  "シミュレータを体験して〜と感じた",
  "私は〜を優先した。なぜなら〜",
  "次は〜さんのために設計したい。その人は〜",
];

export function ReflectionForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const user = useCurrentUser();
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [persisted, setPersisted] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    (async () => {
      try {
        const r = await getReflection(user.id);
        if (active && r) {
          setAnswers([r.answer_1 ?? "", r.answer_2 ?? "", r.answer_3 ?? ""]);
        }
      } catch {
        if (active) setPersisted(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user.id]);

  function setAnswer(i: number, v: string) {
    setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
    setDone(false);
  }

  async function handleSubmit() {
    if (saving) return;
    setSaving(true);
    if (isSupabaseConfigured()) {
      try {
        await saveReflection(user.id, {
          answer1: answers[0],
          answer2: answers[1],
          answer3: answers[2],
        });
      } catch {
        setPersisted(false);
      }
    }
    setSaving(false);
    setDone(true);
    onSubmitted?.();
  }

  const filled = answers.some((a) => a.trim().length > 0);

  return (
    <div className="space-y-4">
      {LABELS.map((label, i) => (
        <div key={label} className="space-y-1.5">
          <label htmlFor={`refl-${i}`} className="text-sm font-medium">
            {label}
          </label>
          <textarea
            id={`refl-${i}`}
            value={answers[i]}
            onChange={(e) => setAnswer(i, e.target.value)}
            rows={3}
            placeholder={HINTS[i]}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={saving || !filled}>
          {saving ? "保存中…" : "提出する"}
        </Button>
        {done && (
          <span className="text-sm text-green-600">
            ✓ 提出しました{!persisted && "（このセッション内のみ）"}
          </span>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { saveNote } from "@/lib/repo/notes";
import { Button } from "@/components/ui/button";

// 記述メモ（notes へ保存）。STEP1の基発問・STEP3の気づきメモなどで使い回す。
// 接続時は notes へ保存、未接続時はセッション内のみ。
export function NoteField({
  id = "note",
  label = "気づきメモ",
  placeholder = "シミュレータを体験して気づいたこと",
}: {
  id?: string;
  label?: string;
  placeholder?: string;
} = {}) {
  const user = useCurrentUser();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const persisted = isSupabaseConfigured();

  async function handleSave() {
    if (!content.trim() || saving) return;
    setSaving(true);
    if (persisted) {
      try {
        await saveNote(user.id, content.trim());
      } catch {
        // 保存失敗はセッション内表示で継続
      }
    }
    setSaving(false);
    setDone(true);
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setDone(false);
        }}
        rows={3}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving || !content.trim()}
        >
          保存
        </Button>
        {done && (
          <span className="text-sm text-green-600">
            ✓ 保存しました{!persisted && "（このセッション内のみ）"}
          </span>
        )}
      </div>
    </div>
  );
}

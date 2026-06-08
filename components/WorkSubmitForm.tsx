"use client";

import { useState } from "react";
import { ColorEditor } from "@/components/ColorEditor";
import { useWorks } from "@/components/WorksProvider";
import { Button } from "@/components/ui/button";
import { designMinContrast } from "@/lib/wcag";
import type { DesignData } from "@/lib/types";

const DEFAULT: DesignData = {
  bg: "#FFFFFF",
  text: "#1A1A1A",
  button: "#0B5FAE",
  buttonText: "#FFFFFF",
  accent: "#B45309",
};

export function WorkSubmitForm() {
  const { submit, persisted } = useWorks();
  const [design, setDesign] = useState<DesignData>(DEFAULT);
  const [intent, setIntent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!intent.trim() || saving) return;
    setSaving(true);
    await submit({
      designData: design,
      intentMemo: intent.trim(),
      wcagScore: Math.round(designMinContrast(design) * 100) / 100,
      isPublic,
    });
    setSaving(false);
    setDone(true);
    setIntent("");
  }

  return (
    <div className="space-y-4">
      <ColorEditor initial={DEFAULT} onChange={setDesign} />

      <div className="space-y-2">
        <label htmlFor="intent" className="text-sm font-medium">
          設計意図
        </label>
        <textarea
          id="intent"
          value={intent}
          onChange={(e) => {
            setIntent(e.target.value);
            setDone(false);
          }}
          rows={3}
          placeholder="どんな狙いで配色したか（実在の家族の個人情報は書かないでね）"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        作品ライブラリに公開する（任意・既定は非公開）
      </label>

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={saving || !intent.trim()}>
          {saving ? "提出中…" : "提出する"}
        </Button>
        {done && (
          <span className="text-sm text-green-600">
            ✓ 提出しました{!persisted && "（このセッション内のみ保持）"}
          </span>
        )}
      </div>
    </div>
  );
}

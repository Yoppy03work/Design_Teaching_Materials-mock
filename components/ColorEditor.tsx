"use client";

import { useState } from "react";
import type { DesignData } from "@/lib/types";
import { ContrastChecker } from "@/components/ContrastChecker";
import { Button } from "@/components/ui/button";

// プリセット（白紙からでなく改変から始められるように）。
const PRESETS: { name: string; data: DesignData }[] = [
  {
    name: "高コントラスト",
    data: {
      bg: "#FFFFFF",
      text: "#1A1A1A",
      button: "#0B5FAE",
      buttonText: "#FFFFFF",
      accent: "#B45309",
    },
  },
  {
    name: "機能優先",
    data: {
      bg: "#FFFFFF",
      text: "#1A1A1A",
      button: "#0B5FAE",
      buttonText: "#FFFFFF",
      accent: "#D87A00",
    },
  },
  {
    name: "感情優先（セピア）",
    data: {
      bg: "#FBF7EF",
      text: "#3A2E1F",
      button: "#8C5A2B",
      buttonText: "#FFFFFF",
      accent: "#C24914",
    },
  },
  {
    name: "対話優先（青系）",
    data: {
      bg: "#F2F5F7",
      text: "#16242E",
      button: "#1C6E8C",
      buttonText: "#FFFFFF",
      accent: "#E0A100",
    },
  },
];

const FIELDS: { key: keyof DesignData; label: string }[] = [
  { key: "bg", label: "背景色" },
  { key: "text", label: "文字色" },
  { key: "button", label: "ボタン色" },
  { key: "buttonText", label: "ボタン文字色" },
  { key: "accent", label: "アクセント色" },
];

export function ColorEditor({
  initial,
  onChange,
}: {
  initial?: DesignData;
  onChange?: (design: DesignData) => void;
}) {
  const [design, setDesign] = useState<DesignData>(initial ?? PRESETS[0].data);

  function update(next: DesignData) {
    setDesign(next);
    onChange?.(next);
  }

  function setColor(key: keyof DesignData, value: string) {
    update({ ...design, [key]: value });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">プリセット（改変して始める）</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.name}
                variant="outline"
                size="sm"
                onClick={() => update(p.data)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <label className="w-28 text-sm" htmlFor={`color-${f.key}`}>
                {f.label}
              </label>
              <input
                id={`color-${f.key}`}
                type="color"
                value={design[f.key]}
                onChange={(e) => setColor(f.key, e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border bg-background"
                aria-label={`${f.label}（カラーピッカー）`}
              />
              <input
                type="text"
                value={design[f.key]}
                onChange={(e) => setColor(f.key, e.target.value)}
                spellCheck={false}
                className="w-28 rounded-md border bg-background px-2 py-1 font-mono text-sm uppercase"
                aria-label={`${f.label}（HEX）`}
              />
            </div>
          ))}
        </div>

        <ContrastChecker design={design} />
      </div>

      <AlbumPreview design={design} />
    </div>
  );
}

// 配色を反映したアルバムサイトのモックプレビュー。
function AlbumPreview({ design }: { design: DesignData }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">プレビュー（祖父のアルバムサイト）</p>
      <div
        className="overflow-hidden rounded-xl border shadow-sm"
        style={{ backgroundColor: design.bg, color: design.text }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${design.text}22` }}
        >
          <span className="text-lg font-bold">家族のアルバム</span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: design.accent, color: design.bg }}
          >
            NEW
          </span>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-sm leading-relaxed">
            いちばん新しい思い出をここに。大きな文字と高いコントラストで、祖父にも見やすく。
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={{ backgroundColor: `${design.text}14` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 pt-1">
            <span
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: design.button, color: design.buttonText }}
            >
              写真を追加
            </span>
            <span
              className="text-sm font-medium underline"
              style={{ color: design.accent }}
            >
              すべて見る
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

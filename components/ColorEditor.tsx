"use client";

import { useState } from "react";
import type { DesignData } from "@/lib/types";
import { ContrastChecker } from "@/components/ContrastChecker";
import { Button } from "@/components/ui/button";
import { DesignedAlbum } from "@/components/DesignedAlbum";
import { DESIGN_DEFAULTS, FONT_SIZE_MAX, FONT_SIZE_MIN } from "@/lib/design";

// プリセット（白紙からでなく改変から始められるように）。
const PRESETS: { name: string; data: DesignData }[] = [
  { name: "高コントラスト", data: DESIGN_DEFAULTS },
  {
    name: "機能優先",
    data: {
      bg: "#FFFFFF",
      text: "#1A1A1A",
      surface: "#EAF2FB",
      heading: "#0B5FAE",
      button: "#0B5FAE",
      buttonText: "#FFFFFF",
      accent: "#D87A00",
      fontSize: 18,
    },
  },
  {
    name: "感情優先（セピア）",
    data: {
      bg: "#FBF7EF",
      text: "#3A2E1F",
      surface: "#F0E6D2",
      heading: "#5A3A1A",
      button: "#8C5A2B",
      buttonText: "#FFFFFF",
      accent: "#C24914",
      fontSize: 20,
    },
  },
  {
    name: "対話優先（青系）",
    data: {
      bg: "#F2F5F7",
      text: "#16242E",
      surface: "#DCE6EC",
      heading: "#16242E",
      button: "#1C6E8C",
      buttonText: "#FFFFFF",
      accent: "#E0A100",
      fontSize: 18,
    },
  },
];

// 色フィールド（文字サイズは別UIで扱う）。
type ColorKey = Exclude<keyof DesignData, "fontSize">;
const FIELDS: { key: ColorKey; label: string }[] = [
  { key: "bg", label: "背景色" },
  { key: "text", label: "文字色" },
  { key: "heading", label: "見出し色" },
  { key: "surface", label: "見出し帯" },
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

  function setField<K extends keyof DesignData>(key: K, value: DesignData[K]) {
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
                onChange={(e) => setField(f.key, e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border bg-background"
                aria-label={`${f.label}（カラーピッカー）`}
              />
              <input
                type="text"
                value={design[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                spellCheck={false}
                className="w-28 rounded-md border bg-background px-2 py-1 font-mono text-sm uppercase"
                aria-label={`${f.label}（HEX）`}
              />
            </div>
          ))}
        </div>

        {/* 文字サイズ（老眼の祖父向けに大きさを調整） */}
        <div className="space-y-2">
          <label htmlFor="font-size" className="text-sm font-medium">
            文字サイズ：{design.fontSize}px
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">小</span>
            <input
              id="font-size"
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={1}
              value={design.fontSize}
              onChange={(e) => setField("fontSize", parseInt(e.target.value, 10))}
              className="flex-1"
              aria-label="文字サイズ（px）"
            />
            <span className="text-lg text-muted-foreground">大</span>
          </div>
          <p className="text-xs text-muted-foreground">
            老眼の祖父には大きめが見やすい（目安：18px以上）。
          </p>
        </div>

        <ContrastChecker design={design} />
      </div>

      <AlbumPreview design={design} />
    </div>
  );
}

// 配色・文字サイズを反映したアルバムサイトのモックプレビュー。
function AlbumPreview({ design }: { design: DesignData }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">プレビュー（祖父のアルバムサイト）</p>
      <DesignedAlbum design={design} titleHref="/album" />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { DesignData } from "@/lib/types";
import { ContrastChecker } from "@/components/ContrastChecker";
import { Button } from "@/components/ui/button";
import { DesignedAlbum } from "@/components/DesignedAlbum";
import {
  DESIGN_DEFAULTS,
  FONT_FAMILIES,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
} from "@/lib/design";
import { cn } from "@/lib/utils";

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
      tag1: "#1A73E8",
      tag2: "#E8710A",
      tag3: "#12B5CB",
      commentBg: "#EAF2FB",
      fontSize: 18,
      fontFamily: "sans",
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
      tag1: "#C24914",
      tag2: "#8C5A2B",
      tag3: "#A88300",
      commentBg: "#F0E6D2",
      fontSize: 20,
      fontFamily: "serif",
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
      tag1: "#1C6E8C",
      tag2: "#2E7D32",
      tag3: "#6A4C93",
      commentBg: "#DCE6EC",
      fontSize: 18,
      fontFamily: "rounded",
    },
  },
];

// 色フィールド（fontSize / fontFamily は別UIで扱う）。
type ColorKey = Exclude<keyof DesignData, "fontSize" | "fontFamily">;
const COLOR_GROUPS: {
  title: string;
  fields: { key: ColorKey; label: string }[];
}[] = [
  {
    title: "基本",
    fields: [
      { key: "bg", label: "背景色" },
      { key: "text", label: "文字色" },
      { key: "heading", label: "見出し色" },
      { key: "surface", label: "バー/カード" },
      { key: "button", label: "ボタン色" },
      { key: "buttonText", label: "ボタン文字色" },
      { key: "accent", label: "アクセント色" },
    ],
  },
  {
    title: "タグ（カテゴリ）",
    fields: [
      { key: "tag1", label: "タグ：家族" },
      { key: "tag2", label: "タグ：旅行" },
      { key: "tag3", label: "タグ：お祝い" },
    ],
  },
  {
    title: "コメント",
    fields: [{ key: "commentBg", label: "吹き出し背景" }],
  },
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
    <div className="grid gap-6 lg:grid-cols-[minmax(300px,360px)_1fr]">
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

        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-sm font-medium">{group.title}</p>
            {group.fields.map((f) => (
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
        ))}

        {/* フォント */}
        <div className="space-y-2">
          <p className="text-sm font-medium">フォント</p>
          <div className="flex flex-wrap gap-2">
            {FONT_FAMILIES.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={design.fontFamily === f.key}
                onClick={() => setField("fontFamily", f.key)}
                style={{ fontFamily: f.css }}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  design.fontFamily === f.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
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

// 配色・文字サイズ・フォントを反映したフォトサイトのモックプレビュー。
function AlbumPreview({ design }: { design: DesignData }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">プレビュー（祖父のフォト）</p>
      <DesignedAlbum design={design} titleHref="/album" />
    </div>
  );
}

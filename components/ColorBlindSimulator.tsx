"use client";

import { useId, useState } from "react";
import {
  CVD_TYPES,
  machadoMatrix,
  simulateBrettel,
  simulateMachado,
  toFeColorMatrix,
  type CvdType,
} from "@/lib/colorblind";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { ALBUM_PHOTOS } from "@/lib/albumPhotos";
import { AlbumPhoto } from "@/components/AlbumPhoto";

// シーン色（赤緑の混同が見えるよう複数の有彩色を含める）
const SCENE = {
  important: "#D32F2F", // 赤
  done: "#388E3C", // 緑
  info: "#1976D2", // 青
  warn: "#F9A825", // 黄
};
const PALETTE = ["#D32F2F", "#388E3C", "#1976D2", "#F9A825", "#7B1FA2", "#00897B"];

export function ColorBlindSimulator() {
  const [type, setType] = useState<CvdType>("deutan");
  const [severity, setSeverity] = useState(0.6);
  const [showSim, setShowSim] = useState(true); // true=他者(祖父)の見え方
  const [enlarged, setEnlarged] = useState(false);
  const filterId = `cvd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const matrixValues = toFeColorMatrix(machadoMatrix(type, severity));
  const pct = Math.round(severity * 100);
  const typeLabel = CVD_TYPES.find((t) => t.key === type)?.label ?? "";

  return (
    <div className="space-y-6">
      {/* SVGフィルタ定義（線形RGBで適用） */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <filter id={filterId} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={matrixValues} />
        </filter>
      </svg>

      {/* コントロール */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">型：</span>
          {CVD_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={type === t.key}
              onClick={() => setType(t.key)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                type === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
          <span className="text-sm text-muted-foreground">
            {CVD_TYPES.find((t) => t.key === type)?.note}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="cvd-severity" className="text-sm font-medium">
            程度（Machado 2009）：{pct}%
          </label>
          <input
            id="cvd-severity"
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={severity}
            onChange={(e) => setSeverity(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="text-xs text-muted-foreground">
            0%＝健常者 〜 100%＝完全二色覚
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">表示：</span>
          <button
            type="button"
            aria-pressed={!showSim}
            onClick={() => setShowSim(false)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              !showSim
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            自分の見え方（原画）
          </button>
          <button
            type="button"
            aria-pressed={showSim}
            onClick={() => setShowSim(true)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              showSim
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            他者（祖父）の見え方
          </button>
        </div>
      </div>

      {/* シーンプレビュー（Machado を SVG フィルタで適用） */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">
            アルバムサイトの見え方（{showSim ? `${typeLabel}・${pct}%` : "原画"}）
          </p>
          <button
            type="button"
            onClick={() => setEnlarged(true)}
            className="shrink-0 rounded-md border px-2 py-1 text-xs hover:bg-muted"
          >
            ⤢ 大きく見る
          </button>
        </div>
        <div style={showSim ? { filter: `url(#${filterId})` } : undefined}>
          <AlbumScene />
        </div>
      </div>

      {/* 手法くらべ（離散色を JS で計算：Machado vs Brettel完全二色覚） */}
      <div className="space-y-2">
        <p className="text-sm font-medium">色の見え方くらべ</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="p-2 text-left font-medium">原色</th>
                <th className="p-2 font-medium">Machado {pct}%</th>
                <th className="p-2 font-medium">Brettel 完全二色覚</th>
              </tr>
            </thead>
            <tbody>
              {PALETTE.map((c) => (
                <tr key={c}>
                  <td className="p-2">
                    <Swatch hex={c} />
                  </td>
                  <td className="p-2">
                    <Swatch hex={simulateMachado(c, type, severity)} />
                  </td>
                  <td className="p-2">
                    <Swatch hex={simulateBrettel(c, type, 1)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          ※ シーンは Machado 2009（程度つき）を線形RGBで適用。右端は Brettel
          1997 の完全二色覚（T型でも正確）。
        </p>
      </div>

      <Modal
        open={enlarged}
        onClose={() => setEnlarged(false)}
        title={`アルバムサイトの見え方（${showSim ? `${typeLabel}・${pct}%` : "原画"}）`}
        panelClassName="max-w-4xl"
      >
        <div style={showSim ? { filter: `url(#${filterId})` } : undefined}>
          <AlbumScene />
        </div>
      </Modal>
    </div>
  );
}

function Swatch({ hex }: { hex: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <span
        className="size-10 rounded-md border"
        style={{ backgroundColor: hex }}
      />
      <span className="font-mono text-[10px] text-muted-foreground">
        {hex.toUpperCase()}
      </span>
    </span>
  );
}

function AlbumScene() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white text-neutral-900 shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-lg font-bold">家族のアルバム</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: SCENE.important }}
        >
          重要
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Tag color={SCENE.important} label="重要" />
          <Tag color={SCENE.done} label="完了" />
          <Tag color={SCENE.info} label="お知らせ" />
          <Tag color={SCENE.warn} label="注意" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALBUM_PHOTOS.map((src, i) => (
            <AlbumPhoto key={i} src={src} />
          ))}
        </div>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: SCENE.done }}
        >
          写真を追加
        </button>
      </div>
    </div>
  );
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

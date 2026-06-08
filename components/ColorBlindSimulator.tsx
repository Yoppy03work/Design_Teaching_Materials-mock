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
import { AlbumScene } from "@/components/AlbumScene";
import { CvdControls } from "@/components/CvdControls";

const PALETTE = ["#D32F2F", "#388E3C", "#1976D2", "#F9A825", "#7B1FA2", "#00897B"];

export function ColorBlindSimulator() {
  const [type, setType] = useState<CvdType>("deutan");
  const [severity, setSeverity] = useState(0.6);
  const [showSim, setShowSim] = useState(true); // true=他者(祖父)の見え方
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
      <CvdControls
        type={type}
        severity={severity}
        showSim={showSim}
        onType={setType}
        onSeverity={setSeverity}
        onShowSim={setShowSim}
      />

      {/* シーンプレビュー（Machado を SVG フィルタで適用） */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          アルバムサイトの見え方（{showSim ? `${typeLabel}・${pct}%` : "原画"}）
        </p>
        <div style={showSim ? { filter: `url(#${filterId})` } : undefined}>
          <AlbumScene titleHref="/album" />
        </div>
        <p className="text-xs text-muted-foreground">
          「家族のアルバム」を押すと、別ページ（全幅）で大きく開けます。
        </p>
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

"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  CVD_TYPES,
  machadoMatrix,
  toFeColorMatrix,
  type CvdType,
} from "@/lib/colorblind";
import { AlbumScene } from "@/components/AlbumScene";
import { CvdControls } from "@/components/CvdControls";

// 「祖父のアルバムサイト」を全幅で開く独立ページ。
// STEP3/STEP5 の「家族のアルバム」見出しからリンクされる。
export default function AlbumPage() {
  const [type, setType] = useState<CvdType>("deutan");
  const [severity, setSeverity] = useState(0.6);
  const [showSim, setShowSim] = useState(true);
  const filterId = `cvd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const matrixValues = toFeColorMatrix(machadoMatrix(type, severity));
  const pct = Math.round(severity * 100);
  const typeLabel = CVD_TYPES.find((t) => t.key === type)?.label ?? "";

  // 戻り先：?from=stepN があればそのステップへ、無ければレッスン一覧へ。
  const [backHref, setBackHref] = useState("/lesson");
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && /^step[1-7]$/.test(from)) setBackHref(`/lesson/step/${from}`);
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      {/* SVGフィルタ定義（線形RGBで適用） */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <filter id={filterId} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={matrixValues} />
        </filter>
      </svg>

      <header className="space-y-1">
        <p className="text-sm">
          <Link
            href={backHref}
            className="text-muted-foreground underline underline-offset-4 hover:no-underline"
          >
            ← レッスンに戻る
          </Link>
        </p>
        <h1 className="text-2xl font-bold">祖父のアルバムサイト</h1>
        <p className="text-sm text-muted-foreground">
          色覚のタイプと程度を切り替えて、祖父の見え方を全幅で体験できます。
          現在の表示：{showSim ? `${typeLabel}・${pct}%` : "原画（自分の見え方）"}
        </p>
      </header>

      <CvdControls
        type={type}
        severity={severity}
        showSim={showSim}
        onType={setType}
        onSeverity={setSeverity}
        onShowSim={setShowSim}
      />

      <div style={showSim ? { filter: `url(#${filterId})` } : undefined}>
        <AlbumScene />
      </div>

      <p className="text-xs text-muted-foreground">
        ※ 写真はAI生成のサンプルで、実在の人物・家族ではありません。色覚シミュレーションは
        Machado 2009 を線形RGBで適用しています。
      </p>
    </main>
  );
}

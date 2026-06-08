"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import {
  CVD_TYPES,
  machadoMatrix,
  toFeColorMatrix,
  type CvdType,
} from "@/lib/colorblind";
import { getWork } from "@/lib/repo/works";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SAMPLE_WORKS } from "@/lib/sampleWorks";
import { normalizeDesign } from "@/lib/design";
import { wcagRating } from "@/lib/wcag";
import { DesignedAlbum } from "@/components/DesignedAlbum";
import { CvdControls } from "@/components/CvdControls";
import { ContrastChecker } from "@/components/ContrastChecker";
import type { Philosophy, Work } from "@/lib/types";

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

// 作品（その人が作った配色）でアルバムサイトを全幅表示するページ。
// STEP6 の作品ライブラリから各カードを押すと開く。
export default function WorkPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");
  // undefined=読み込み中 / null=見つからない
  const [work, setWork] = useState<Work | null | undefined>(undefined);

  const [type, setType] = useState<CvdType>("deutan");
  const [severity, setSeverity] = useState(0.6);
  const [showSim, setShowSim] = useState(false); // 既定は原画（その人の配色そのまま）
  const filterId = `cvd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const matrixValues = toFeColorMatrix(machadoMatrix(type, severity));
  const pct = Math.round(severity * 100);
  const typeLabel = CVD_TYPES.find((t) => t.key === type)?.label ?? "";

  useEffect(() => {
    // まず静的なサンプル作品から探す（Supabase 未接続でも開ける）。
    const sample = SAMPLE_WORKS.find((w) => w.id === id);
    if (sample) {
      setWork(sample);
      return;
    }
    // それ以外は Supabase 接続時のみ取得（セッションのみの作品は別ページからは開けない）。
    if (isSupabaseConfigured()) {
      getWork(id)
        .then((w) => setWork(w))
        .catch(() => setWork(null));
    } else {
      setWork(null);
    }
  }, [id]);

  const back = (
    <p className="text-sm">
      <Link
        href="/lesson/step/step6"
        className="text-muted-foreground underline underline-offset-4 hover:no-underline"
      >
        ← 作品ライブラリに戻る
      </Link>
    </p>
  );

  if (work === undefined) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-6">
        {back}
        <p className="text-sm text-muted-foreground">読み込み中…</p>
      </main>
    );
  }

  if (work === null) {
    return (
      <main className="mx-auto max-w-4xl space-y-4 p-6">
        {back}
        <h1 className="text-xl font-bold">作品が見つかりません</h1>
        <p className="text-sm text-muted-foreground">
          この作品は表示できません（Supabase 未接続では、このセッションで提出した作品は別ページから開けません）。
        </p>
      </main>
    );
  }

  const design = normalizeDesign(work.design_data);
  const rating = work.wcag_score != null ? wcagRating(work.wcag_score) : null;

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      {/* SVGフィルタ定義（線形RGBで適用） */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <filter id={filterId} colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values={matrixValues} />
        </filter>
      </svg>

      <header className="space-y-2">
        {back}
        <h1 className="text-2xl font-bold">
          {work.type === "sample" && work.philosophy
            ? `${PHILOSOPHY_LABEL[work.philosophy]}の作品`
            : "作品のページ"}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {work.type === "student" && (
            <span className="rounded-full bg-muted px-2 py-0.5">生徒作品</span>
          )}
          {work.wcag_score != null && rating && (
            <span className="text-muted-foreground">
              最小コントラスト {work.wcag_score.toFixed(2)}:1（{RATING_LABEL[rating]}
              ）
            </span>
          )}
          <span className="text-muted-foreground">文字 {design.fontSize}px</span>
        </div>
        {work.intent_memo && <p className="text-sm">{work.intent_memo}</p>}
      </header>

      <CvdControls
        type={type}
        severity={severity}
        showSim={showSim}
        onType={setType}
        onSeverity={setSeverity}
        onShowSim={setShowSim}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">
          この配色のページ（{showSim ? `${typeLabel}・${pct}%` : "原画"}）
        </p>
        <div style={showSim ? { filter: `url(#${filterId})` } : undefined}>
          <DesignedAlbum design={design} />
        </div>
      </div>

      <ContrastChecker design={design} />

      <p className="text-xs text-muted-foreground">
        ※ 写真はAI生成のサンプルです。「他者（祖父）の見え方」に切り替えると、この配色を祖父がどう見るかを確認できます。
      </p>
    </main>
  );
}

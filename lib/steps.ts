import type { StepId } from "@/lib/types";

/** 学習フロー（STEP1〜7）のメタ情報。レッスン画面の出し分けに使う。 */
export type StepMeta = {
  id: StepId;
  order: number;
  title: string;
  summary: string;
};

export const STEPS: StepMeta[] = [
  { id: "step1", order: 1, title: "導入", summary: "イントロ動画＋基発問＋祖父紹介" },
  {
    id: "step2",
    order: 2,
    title: "動画①「祖父の見え方」",
    summary: "色覚多様性と老眼を知る（約5分）",
  },
  {
    id: "step3",
    order: 3,
    title: "演習①色弱シミュレータ体験",
    summary: "見え方を体験し、気づきをメモ",
  },
  {
    id: "step4",
    order: 4,
    title: "動画②「WCAGとデザインの原則」",
    summary: "コントラストと配色の原則（約5分）",
  },
  {
    id: "step5",
    order: 5,
    title: "演習②配色エディタで設計",
    summary: "WCAG確認＋AI壁打ち＋提出",
  },
  {
    id: "step6",
    order: 6,
    title: "作品ライブラリ",
    summary: "サンプル3作品を閲覧しコメント",
  },
  {
    id: "step7",
    order: 7,
    title: "振り返り",
    summary: "まとめ動画＋振り返り3問",
  },
];

export const STEP_IDS: StepId[] = STEPS.map((s) => s.id);

export function getStep(id: string): StepMeta | undefined {
  return STEPS.find((s) => s.id === id);
}

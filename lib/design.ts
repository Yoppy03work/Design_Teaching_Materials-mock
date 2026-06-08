// 配色・文字サイズ・フォントの既定値とユーティリティ。
import type { DesignData } from "@/lib/types";

// 文字サイズの調整範囲（px）。老眼の祖父向けに大きめも選べるようにする。
export const FONT_SIZE_MIN = 14;
export const FONT_SIZE_MAX = 28;

// 選べるフォント（プレビューに font-family として適用。値はキーで保存）。
export const FONT_FAMILIES = [
  {
    key: "sans",
    label: "ゴシック体",
    css: '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", system-ui, sans-serif',
  },
  {
    key: "serif",
    label: "明朝体",
    css: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
  },
  {
    key: "rounded",
    label: "丸ゴシック",
    css: '"Hiragino Maru Gothic ProN", "Rounded Mplus 1c", "Yu Gothic", system-ui, sans-serif',
  },
] as const;

// フォントキー → CSS font-family。未知のキーは先頭（ゴシック体）にフォールバック。
export function resolveFontFamily(key: string): string {
  return FONT_FAMILIES.find((f) => f.key === key)?.css ?? FONT_FAMILIES[0].css;
}

// 新規作成の初期値。旧データ（新フィールド欠落）の正規化フォールバックにも使う。
export const DESIGN_DEFAULTS: DesignData = {
  bg: "#FFFFFF",
  text: "#1A1A1A",
  surface: "#FFFFFF",
  heading: "#1A1A1A",
  button: "#0B5FAE",
  buttonText: "#FFFFFF",
  accent: "#B45309",
  tag1: "#1A73E8",
  tag2: "#34A853",
  tag3: "#EA4335",
  commentBg: "#F1F3F4",
  fontSize: 18,
  fontFamily: "sans",
};

// 旧 design_data（新フィールド欠落）を安全に補完する。
// 見た目を変えないよう、surface→背景色 / heading→文字色 / commentBg→カード色 にフォールバック。
export function normalizeDesign(
  d: Partial<DesignData> | null | undefined,
): DesignData {
  return {
    bg: d?.bg ?? DESIGN_DEFAULTS.bg,
    text: d?.text ?? DESIGN_DEFAULTS.text,
    surface: d?.surface ?? d?.bg ?? DESIGN_DEFAULTS.surface,
    heading: d?.heading ?? d?.text ?? DESIGN_DEFAULTS.heading,
    button: d?.button ?? DESIGN_DEFAULTS.button,
    buttonText: d?.buttonText ?? DESIGN_DEFAULTS.buttonText,
    accent: d?.accent ?? DESIGN_DEFAULTS.accent,
    tag1: d?.tag1 ?? DESIGN_DEFAULTS.tag1,
    tag2: d?.tag2 ?? DESIGN_DEFAULTS.tag2,
    tag3: d?.tag3 ?? DESIGN_DEFAULTS.tag3,
    commentBg: d?.commentBg ?? d?.surface ?? DESIGN_DEFAULTS.commentBg,
    fontSize: d?.fontSize ?? DESIGN_DEFAULTS.fontSize,
    fontFamily: d?.fontFamily ?? DESIGN_DEFAULTS.fontFamily,
  };
}

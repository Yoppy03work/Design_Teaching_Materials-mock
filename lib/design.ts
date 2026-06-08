// 配色・文字サイズの既定値とユーティリティ。
import type { DesignData } from "@/lib/types";

// 文字サイズの調整範囲（px）。老眼の祖父向けに大きめも選べるようにする。
export const FONT_SIZE_MIN = 14;
export const FONT_SIZE_MAX = 28;

// 新規作成の初期値。旧データ（新フィールド欠落）の正規化フォールバックにも使う。
export const DESIGN_DEFAULTS: DesignData = {
  bg: "#FFFFFF",
  text: "#1A1A1A",
  surface: "#FFFFFF",
  heading: "#1A1A1A",
  button: "#0B5FAE",
  buttonText: "#FFFFFF",
  accent: "#B45309",
  fontSize: 18,
};

// 旧 design_data（surface/heading/fontSize が無い）を安全に補完する。
// 見た目を変えないよう、surface は背景色、heading は文字色にフォールバックする。
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
    fontSize: d?.fontSize ?? DESIGN_DEFAULTS.fontSize,
  };
}

// WCAG コントラスト比の計算ロジック。
// 相対輝度（relative luminance）と、コントラスト比 = (L1 + 0.05) / (L2 + 0.05)。
// 参考: WCAG 2.1 https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
import type { DesignData } from "@/lib/types";

export type WcagRating = "AAA" | "AA" | "AA-Large" | "Fail";

/** "#RRGGBB" / "#RGB" を {r,g,b}(0–255) に。無効なら null。 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const s = hex.trim();
  // 先頭の # を必須にする（"FFFFFF" のような # 無しは無効として扱い、スコアと表示を一致させる）。
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)) return null;
  let h = s.slice(1);
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function channelLuminance(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** sRGB の相対輝度（0–1）。 */
export function relativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

/** 2色のコントラスト比（1–21）。無効な色は NaN。 */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return NaN;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * コントラスト比から到達等級を返す。
 * AAA: 7:1以上 / AA: 4.5:1以上 / 大字AA(AA-Large): 3:1以上（大きい文字のみAA）/ それ未満は失格。
 */
export function wcagRating(ratio: number): WcagRating {
  if (Number.isNaN(ratio)) return "Fail";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-Large";
  return "Fail";
}

export type ContrastPair = { label: string; fg: string; bg: string };

/** 配色データから、確認すべき主要な色ペアを返す。 */
export function designContrastPairs(d: DesignData): ContrastPair[] {
  return [
    { label: "本文（背景 × 文字）", fg: d.text, bg: d.bg },
    { label: "見出し帯（帯 × 見出し）", fg: d.heading, bg: d.surface },
    { label: "ボタン（ボタン色 × ボタン文字）", fg: d.buttonText, bg: d.button },
    { label: "アクセント（背景 × アクセント）", fg: d.accent, bg: d.bg },
    { label: "コメント（吹き出し × 文字）", fg: d.text, bg: d.commentBg },
  ];
}

/**
 * 主要ペアの最小コントラスト比（提出時のスコア用）。
 * 無効な色（不正なHEX）は黙って除外せず、最低コントラスト比＝1（失格）として扱う。
 * ColorEditor は任意のテキスト入力を保持するため、壊れた色がスコアを過大評価しないように。
 */
export function designMinContrast(d: DesignData): number {
  const ratios = designContrastPairs(d).map((p) => {
    const r = contrastRatio(p.fg, p.bg);
    return Number.isNaN(r) ? 1 : r;
  });
  return ratios.length > 0 ? Math.min(...ratios) : 1;
}

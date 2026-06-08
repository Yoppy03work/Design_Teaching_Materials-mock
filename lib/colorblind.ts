// 色覚多様性（CVD）シミュレーション。
//
// 採用手法（教材方針）:
//   - 主軸: Machado, Oliveira & Fernandes (2009)。程度(severity 0–1)を表現でき、
//     ペルソナ「祖父（赤緑色弱＝異常三色覚）」に最も適合。P/D/T 対応。
//   - 併用: Brettel, Mollon & Viénot (1997)。完全二色覚の定番で T 型でも正確。
//
// 重要: これらの行列は「線形RGB」で定義される。SVG では feColorMatrix に
//       color-interpolation-filters="linearRGB" を付けてブラウザに線形化させる。
//       JS で1色ずつ計算する場合は sRGB→線形→変換→sRGB を自前で行う（本ファイル）。
//
// 出典:
//   Machado 2009: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
//   Brettel 1997 係数 / 比較・実装注意: https://daltonlens.org/opensource-cvd-simulation/
//   正確な SVG feColorMatrix: https://daltonlens.org/cvd-simulation-svg-filters/
import { hexToRgb } from "@/lib/wcag";
import { MACHADO_2009 } from "@/lib/colorblind-data";

export type CvdType = "protan" | "deutan" | "tritan";

// ---- sRGB ガンマ（sRGB 標準）----
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
  if (c <= 0) return 0;
  if (c >= 1) return 1;
  return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}
function rgbToHex(r: number, g: number, b: number): string {
  const h = (v: number) => clamp255(v).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hexToLinear(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return [
    srgbToLinear(rgb.r / 255),
    srgbToLinear(rgb.g / 255),
    srgbToLinear(rgb.b / 255),
  ];
}
function linearToHex(lin: [number, number, number]): string {
  return rgbToHex(
    linearToSrgb(lin[0]) * 255,
    linearToSrgb(lin[1]) * 255,
    linearToSrgb(lin[2]) * 255,
  );
}

function applyMatrix(
  m: number[],
  lin: [number, number, number],
): [number, number, number] {
  return [
    m[0] * lin[0] + m[1] * lin[1] + m[2] * lin[2],
    m[3] * lin[0] + m[4] * lin[1] + m[5] * lin[2],
    m[6] * lin[0] + m[7] * lin[1] + m[8] * lin[2],
  ];
}

// ---- Machado 2009 ----
const SEVERITY_STEPS = 10;

function severityIndex(severity: number): number {
  const s = Math.max(0, Math.min(1, severity));
  return Math.round(s * SEVERITY_STEPS);
}

/** Machado 2009 の線形RGB 3x3 行列（9要素・行優先）。severity は 0–1。 */
export function machadoMatrix(type: CvdType, severity: number): number[] {
  return MACHADO_2009[type][severityIndex(severity)];
}

/**
 * SVG feColorMatrix 用の 20 値（type="matrix"）。
 * 線形RGBで適用する前提（filter に color-interpolation-filters="linearRGB" を付与）。
 */
export function toFeColorMatrix(m: number[]): string {
  // prettier-ignore
  return [
    m[0], m[1], m[2], 0, 0,
    m[3], m[4], m[5], 0, 0,
    m[6], m[7], m[8], 0, 0,
    0, 0, 0, 1, 0,
  ].join(" ");
}

/** Machado 2009 を1色(HEX)に適用。無効な色はそのまま返す。 */
export function simulateMachado(
  hex: string,
  type: CvdType,
  severity: number,
): string {
  const lin = hexToLinear(hex);
  if (!lin) return hex;
  return linearToHex(applyMatrix(machadoMatrix(type, severity), lin));
}

// ---- Brettel 1997（線形RGB空間で2平面選択。LMS変換は係数に畳み込み済み）----
type BrettelParams = { plane1: number[]; plane2: number[]; normal: number[] };

// 係数は sRGB 較正済み（libDaltonLens）。plane1/plane2: 線形RGB→線形RGBcvd の 3x3、
// normal: 平面選択用の法線（線形RGB空間）。
const BRETTEL: Record<CvdType, BrettelParams> = {
  protan: {
    plane1: [0.1498, 1.19548, -0.34528, 0.10764, 0.84864, 0.04372, 0.00384, -0.0054, 1.00156],
    plane2: [0.1457, 1.16172, -0.30742, 0.10816, 0.85291, 0.03892, 0.00386, -0.00524, 1.00139],
    normal: [0.00048, 0.00393, -0.00441],
  },
  deutan: {
    plane1: [0.36477, 0.86381, -0.22858, 0.26294, 0.64245, 0.09462, -0.02006, 0.02728, 0.99278],
    plane2: [0.37298, 0.88166, -0.25464, 0.25954, 0.63506, 0.1054, -0.0198, 0.02784, 0.99196],
    normal: [-0.00281, -0.00611, 0.00892],
  },
  tritan: {
    plane1: [1.01277, 0.13548, -0.14826, -0.01243, 0.86812, 0.14431, 0.07589, 0.805, 0.11911],
    plane2: [0.93678, 0.18979, -0.12657, 0.06154, 0.81526, 0.1232, -0.37562, 1.12767, 0.24796],
    normal: [0.03901, -0.02788, -0.01113],
  },
};

/**
 * Brettel 1997（完全二色覚）を1色(HEX)に適用。T型でも正確。
 * severity<1 は線形RGB空間での補間（DaltonLens 実装に準拠）。無効な色はそのまま返す。
 */
export function simulateBrettel(
  hex: string,
  type: CvdType,
  severity = 1,
): string {
  const lin = hexToLinear(hex);
  if (!lin) return hex;
  const p = BRETTEL[type];
  const dot = lin[0] * p.normal[0] + lin[1] * p.normal[1] + lin[2] * p.normal[2];
  const dichromat = applyMatrix(dot >= 0 ? p.plane1 : p.plane2, lin);
  const s = Math.max(0, Math.min(1, severity));
  return linearToHex([
    dichromat[0] * s + lin[0] * (1 - s),
    dichromat[1] * s + lin[1] * (1 - s),
    dichromat[2] * s + lin[2] * (1 - s),
  ]);
}

export const CVD_TYPES: { key: CvdType; label: string; note: string }[] = [
  { key: "protan", label: "P型（1型）", note: "赤の感度が低い（赤緑が混同しやすい）" },
  { key: "deutan", label: "D型（2型）", note: "緑の感度が低い（赤緑が混同しやすい）" },
  { key: "tritan", label: "T型（3型）", note: "青と黄が混同しやすい" },
];

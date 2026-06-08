// Supabase 未接続時に作品ライブラリへ表示するサンプル3作品（機能・感情・対話）。
// supabase/migrations/0002_seed.sql のサンプルと対応。wcag_score は実際の配色から算出。
import type { DesignData, Philosophy, Work } from "@/lib/types";
import { designMinContrast } from "@/lib/wcag";

const seeds: Array<{
  id: string;
  philosophy: Philosophy;
  design: DesignData;
  intent: string;
}> = [
  {
    id: "00000000-0000-0000-0000-0000000000a1",
    philosophy: "function",
    design: {
      bg: "#FFFFFF",
      text: "#1A1A1A",
      button: "#0B5FAE",
      buttonText: "#FFFFFF",
      accent: "#D87A00",
    },
    intent:
      "機能優先：最大限のコントラストと明快な色分けで「まず読めること」を最優先した。",
  },
  {
    id: "00000000-0000-0000-0000-0000000000a2",
    philosophy: "emotion",
    design: {
      bg: "#FBF7EF",
      text: "#3A2E1F",
      button: "#8C5A2B",
      buttonText: "#FFFFFF",
      accent: "#C24914",
    },
    intent:
      "感情優先：セピア調の温かみで家族写真の思い出を引き立てた。文字コントラストはAAを確保。",
  },
  {
    id: "00000000-0000-0000-0000-0000000000a3",
    philosophy: "dialogue",
    design: {
      bg: "#F2F5F7",
      text: "#16242E",
      button: "#1C6E8C",
      buttonText: "#FFFFFF",
      accent: "#E0A100",
    },
    intent:
      "対話優先：祖父に何度か見せ、青系の落ち着きと暖色アクセントの組み合わせに調整した。",
  },
];

export const SAMPLE_WORKS: Work[] = seeds.map((s) => ({
  id: s.id,
  user_id: null,
  type: "sample",
  philosophy: s.philosophy,
  persona: "grandfather",
  design_data: s.design,
  intent_memo: s.intent,
  wcag_score: Math.round(designMinContrast(s.design) * 100) / 100,
  is_public: true,
  created_at: "2026-06-08T00:00:00.000Z",
}));

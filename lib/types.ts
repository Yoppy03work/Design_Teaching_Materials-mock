// アプリ全体で共有する型定義。DBスキーマ（supabase/migrations/0001_initial.sql）と対応。

export type Role = "student" | "teacher";

export type StepId =
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7";

export type VideoId = "intro" | "video1" | "video2" | "video3";

export type WorkType = "sample" | "student";

export type Philosophy = "function" | "emotion" | "dialogue";

/** 配色エディタの出力。works.design_data (jsonb) に保存する。 */
export type DesignData = {
  bg: string; // 背景色 (HEX)
  text: string; // 文字色 (HEX)
  surface: string; // 見出し帯・カードの背景色 (HEX)
  heading: string; // 見出しの文字色 (HEX)
  button: string; // ボタン色 (HEX)
  buttonText: string; // ボタン上の文字色 (HEX)
  accent: string; // アクセント色 (HEX)
  fontSize: number; // 本文の基準文字サイズ (px)
};

export type Profile = {
  id: string;
  display_name: string | null;
  role: Role;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  step_id: string;
  completed_at: string;
};

export type VideoLog = {
  id: string;
  user_id: string;
  video_id: string;
  watch_ratio: number;
  updated_at: string;
};

export type Work = {
  id: string;
  user_id: string | null; // サンプルは null
  type: WorkType;
  philosophy: Philosophy | null;
  persona: string;
  design_data: DesignData;
  intent_memo: string | null;
  wcag_score: number | null;
  is_public: boolean;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  content: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  work_id: string;
  content: string;
  created_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  answer_1: string | null;
  answer_2: string | null;
  answer_3: string | null;
  created_at: string;
};

export type AiLog = {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  teacher_id: string;
  student_id: string;
  content: string;
  created_at: string;
};

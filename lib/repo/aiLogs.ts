// AI壁打ちログのデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AiLog } from "@/lib/types";

/**
 * AI壁打ちログを書き込む。書き込みはサーバー(/api/ai)から行うため、呼び出し側が
 * Supabase クライアントを渡す（サーバー: lib/supabase/server.ts の createServiceClient()）。
 * こうしておくと Phase 8 で RLS を有効化しても、ブラウザセッションのないサーバー経路で
 * auth.uid() が null になり insert が拒否される問題を避けられる。
 */
export async function logAi(
  supabase: SupabaseClient,
  userId: string,
  prompt: string,
  response: string,
): Promise<void> {
  const { error } = await supabase
    .from("ai_logs")
    .insert({ user_id: userId, prompt, response });
  if (error) throw error;
}

/** 自分のAI対話履歴を取得（クライアントから読む）。 */
export async function listAiLogs(userId: string): Promise<AiLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AiLog[];
}

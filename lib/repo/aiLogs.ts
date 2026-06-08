// AI壁打ちログのデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { AiLog } from "@/lib/types";

export async function logAi(
  userId: string,
  prompt: string,
  response: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("ai_logs")
    .insert({ user_id: userId, prompt, response });
  if (error) throw error;
}

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

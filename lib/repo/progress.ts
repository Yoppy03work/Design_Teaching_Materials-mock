// 学習進捗のデータ操作。userId は引数で受け取り、アプリ側に auth.uid() を埋め込まない。
// → Phase 8 で RLS を有効化してもこの層は無改修。
import { createClient } from "@/lib/supabase/client";
import type { Progress, StepId } from "@/lib/types";

export async function getProgress(userId: string): Promise<Progress[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as Progress[];
}

export async function completeStep(
  userId: string,
  stepId: StepId,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("progress")
    .upsert(
      { user_id: userId, step_id: stepId },
      { onConflict: "user_id,step_id" },
    );
  if (error) throw error;
}

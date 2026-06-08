// 作品（サンプル＋生徒作品）のデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { DesignData, Work } from "@/lib/types";

export type WorkFilter = "sample" | "all" | "public";

export async function listWorks(filter: WorkFilter): Promise<Work[]> {
  const supabase = createClient();
  let query = supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });
  // 認証後回しフェーズでは公開制御は素通し。Phase 8 で RLS により実効化される。
  if (filter === "sample") query = query.eq("type", "sample");
  else if (filter === "public")
    query = query.eq("type", "student").eq("is_public", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Work[];
}

export async function getWork(id: string): Promise<Work | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Work | null) ?? null;
}

export type SubmitWorkInput = {
  designData: DesignData;
  intentMemo: string;
  wcagScore: number;
  isPublic?: boolean;
};

export async function submitWork(
  userId: string,
  input: SubmitWorkInput,
): Promise<Work> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("works")
    .insert({
      user_id: userId,
      type: "student",
      persona: "grandfather",
      design_data: input.designData,
      intent_memo: input.intentMemo,
      wcag_score: input.wcagScore,
      is_public: input.isPublic ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Work;
}

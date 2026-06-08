// 振り返り（3問）のデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { Reflection } from "@/lib/types";

export type ReflectionInput = {
  answer1: string;
  answer2: string;
  answer3: string;
};

export async function saveReflection(
  userId: string,
  input: ReflectionInput,
): Promise<Reflection> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reflections")
    .insert({
      user_id: userId,
      answer_1: input.answer1,
      answer_2: input.answer2,
      answer_3: input.answer3,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Reflection;
}

export async function getReflection(userId: string): Promise<Reflection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as Reflection | null) ?? null;
}

// 作品へのコメント（ピア閲覧）のデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/lib/types";

export async function listComments(workId: string): Promise<Comment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("work_id", workId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function addComment(
  userId: string,
  workId: string,
  content: string,
): Promise<Comment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: userId, work_id: workId, content })
    .select()
    .single();
  if (error) throw error;
  return data as Comment;
}

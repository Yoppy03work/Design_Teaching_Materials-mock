// 演習①の気づきメモのデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { Note } from "@/lib/types";

export async function saveNote(userId: string, content: string): Promise<Note> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: userId, content })
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function listNotes(userId: string): Promise<Note[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Note[];
}

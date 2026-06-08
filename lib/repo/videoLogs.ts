// 動画視聴ログのデータ操作。
import { createClient } from "@/lib/supabase/client";
import type { VideoLog } from "@/lib/types";

export async function upsertVideoLog(
  userId: string,
  videoId: string,
  watchRatio: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("video_logs").upsert(
    {
      user_id: userId,
      video_id: videoId,
      watch_ratio: watchRatio,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,video_id" },
  );
  if (error) throw error;
}

export async function getVideoLogs(userId: string): Promise<VideoLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("video_logs")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as VideoLog[];
}

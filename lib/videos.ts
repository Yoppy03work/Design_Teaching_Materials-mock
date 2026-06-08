import type { VideoId } from "@/lib/types";

// 動画メタ情報。
// 【プレースホルダ】限定公開YouTubeの本物が用意できるまでの仮の youtubeId。
// 本番では各 youtubeId を限定公開動画のIDに差し替える。
export type VideoMeta = { id: VideoId; title: string; youtubeId: string };

// YouTube 公式のサンプル動画ID（差し替え用プレースホルダ）。
const PLACEHOLDER = "M7lc1UVf-VE";

export const VIDEOS: Record<VideoId, VideoMeta> = {
  intro: { id: "intro", title: "イントロ", youtubeId: PLACEHOLDER },
  video1: { id: "video1", title: "祖父の見え方", youtubeId: PLACEHOLDER },
  video2: { id: "video2", title: "WCAGとデザインの原則", youtubeId: PLACEHOLDER },
  video3: { id: "video3", title: "祖父紹介", youtubeId: PLACEHOLDER },
};

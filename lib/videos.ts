import type { VideoId } from "@/lib/types";

// 動画メタ情報。各 youtubeId は限定公開YouTubeの動画ID。
export type VideoMeta = { id: VideoId; title: string; youtubeId: string };

// 動画は計5本（SPEC §1 の対応表）：
// intro＝教師イントロ / grandfather_intro＝祖父紹介 / video1＝動画①見え方
// / video2＝動画②WCAG / video3＝まとめ動画。
export const VIDEOS: Record<VideoId, VideoMeta> = {
  intro: { id: "intro", title: "イントロ", youtubeId: "3pK7t3jhR6I" },
  grandfather_intro: {
    id: "grandfather_intro",
    title: "祖父紹介",
    youtubeId: "2U8CXFef4I4",
  },
  video1: { id: "video1", title: "祖父の見え方", youtubeId: "yw_7UDpJSFI" },
  video2: {
    id: "video2",
    title: "WCAGとデザインの原則",
    youtubeId: "PS-t0ZL98Wg",
  },
  video3: { id: "video3", title: "まとめ", youtubeId: "Jw0mNNu29SI" },
};

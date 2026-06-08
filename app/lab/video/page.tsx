import { VideoPlayer } from "@/components/VideoPlayer";
import { VIDEOS } from "@/lib/videos";

// 開発プレビュー（Phase 6）。動画プレイヤー＋視聴率トラッキングの確認用。
export default function VideoLabPage() {
  const v = VIDEOS.video1;
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">開発プレビュー（Phase 6）</p>
        <h1 className="text-2xl font-bold tracking-tight">
          動画プレイヤー（視聴率トラッキング）
        </h1>
        <p className="text-muted-foreground">
          再生すると視聴率が記録されます。動画はプレースホルダで、本番では限定公開動画のIDに差し替えます（
          <code className="mx-1">lib/videos.ts</code>）。
        </p>
      </header>
      <VideoPlayer videoId={v.id} youtubeId={v.youtubeId} />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { upsertVideoLog } from "@/lib/repo/videoLogs";
import type { VideoId } from "@/lib/types";

// YouTube埋め込み＋視聴率トラッキング。最大到達率を video_logs に保存（接続時）。
export function VideoPlayer({
  videoId,
  youtubeId,
  onRatio,
}: {
  videoId: VideoId;
  youtubeId: string;
  onRatio?: (ratio: number) => void;
}) {
  const user = useCurrentUser();
  const [ratio, setRatio] = useState(0);
  const maxRatio = useRef(0);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function update(r: number) {
    const clamped = Math.min(1, Math.max(0, r));
    if (clamped > maxRatio.current) {
      maxRatio.current = clamped;
      setRatio(clamped);
      onRatio?.(clamped);
    }
  }

  function persist() {
    const r = maxRatio.current;
    if (r <= 0 || !isSupabaseConfigured()) return;
    upsertVideoLog(user.id, videoId, r).catch(() => {
      // 保存失敗は無視（セッション内の表示は維持）
    });
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling() {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const cur = await p.getCurrentTime();
        const dur = await p.getDuration();
        if (dur > 0) update(cur / dur);
      } catch {
        // プレイヤー未準備などは無視
      }
    }, 1000);
  }

  useEffect(() => {
    return () => {
      stopPolling();
      persist();
    };
    // マウント時の値で十分（videoId/userは固定）。クリーンアップで最終保存する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStateChange(e: YouTubeEvent) {
    const state = e.data; // 1=再生, 2=一時停止, 0=終了
    if (state === 1) {
      startPolling();
    } else {
      stopPolling();
      if (state === 0) update(1);
      persist();
    }
  }

  const pct = Math.round(ratio * 100);

  return (
    <div className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg border">
        <YouTube
          videoId={youtubeId}
          className="size-full"
          iframeClassName="size-full"
          opts={{ playerVars: { rel: 0, modestbranding: 1 } }}
          onReady={(e) => {
            playerRef.current = e.target;
          }}
          onStateChange={handleStateChange}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="動画の視聴進捗"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span>視聴 {pct}%</span>
      </div>
    </div>
  );
}

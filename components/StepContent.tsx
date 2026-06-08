"use client";

import type { StepMeta } from "@/lib/steps";
import { VIDEOS } from "@/lib/videos";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ColorBlindSimulator } from "@/components/ColorBlindSimulator";
import { NoteField } from "@/components/NoteField";
import { WorkSubmitForm } from "@/components/WorkSubmitForm";
import { AIAssistant } from "@/components/AIAssistant";
import { WorkGallery } from "@/components/WorkGallery";
import { ReflectionForm } from "@/components/ReflectionForm";
import { PrivacyNote } from "@/components/PrivacyNote";

// 各ステップの操作画面。lab で作った部品を実フローに差し込む。
export function StepContent({ step }: { step: StepMeta }) {
  switch (step.id) {
    case "step1":
      return (
        <div className="space-y-4">
          <p className="text-sm">
            祖父（68歳・色覚多様性・老眼）のための家族アルバムサイトを設計します。まず導入動画を見ましょう。
          </p>
          <VideoPlayer videoId={VIDEOS.intro.id} youtubeId={VIDEOS.intro.youtubeId} />
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">基発問</p>
            <p>「見やすい配色」とは、誰にとっての見やすさでしょう？</p>
          </div>
          <p className="text-sm text-muted-foreground">祖父を紹介する動画です。</p>
          <VideoPlayer
            videoId={VIDEOS.video3.id}
            youtubeId={VIDEOS.video3.youtubeId}
          />
        </div>
      );
    case "step2":
      return (
        <div className="space-y-4">
          <VideoPlayer
            videoId={VIDEOS.video1.id}
            youtubeId={VIDEOS.video1.youtubeId}
          />
          <p className="text-sm text-muted-foreground">
            祖父の見え方（赤緑色弱・老眼）について学びましょう。
          </p>
        </div>
      );
    case "step3":
      return (
        <div className="space-y-6">
          <p className="text-sm">
            色覚シミュレータで祖父の見え方を体験し、気づいたことをメモしましょう。
          </p>
          <ColorBlindSimulator />
          <PrivacyNote />
          <NoteField />
        </div>
      );
    case "step4":
      return (
        <div className="space-y-4">
          <VideoPlayer
            videoId={VIDEOS.video2.id}
            youtubeId={VIDEOS.video2.youtubeId}
          />
          <p className="text-sm text-muted-foreground">
            WCAGコントラスト比と配色の原則を学びましょう。
          </p>
        </div>
      );
    case "step5":
      return (
        <div className="space-y-8">
          <PrivacyNote />
          <section className="space-y-3">
            <h3 className="font-semibold">配色を設計して提出</h3>
            <WorkSubmitForm />
          </section>
          <section className="space-y-3">
            <h3 className="font-semibold">AIに相談（壁打ち）</h3>
            <AIAssistant />
          </section>
        </div>
      );
    case "step6":
      return (
        <div className="space-y-3">
          <p className="text-sm">
            3つのサンプル作品（機能・感情・対話）を見て、気づきをコメントしましょう。
          </p>
          <WorkGallery filter="sample" />
        </div>
      );
    case "step7":
      return (
        <div className="space-y-3">
          <p className="text-sm">学習を振り返りましょう。</p>
          <ReflectionForm />
        </div>
      );
    default:
      return null;
  }
}

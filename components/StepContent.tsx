"use client";

import Link from "next/link";
import type { StepMeta } from "@/lib/steps";
import { VIDEOS } from "@/lib/videos";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ColorBlindSimulator } from "@/components/ColorBlindSimulator";
import { NoteField } from "@/components/NoteField";
import { WorkGallery } from "@/components/WorkGallery";
import { ReflectionForm } from "@/components/ReflectionForm";
import { PrivacyNote } from "@/components/PrivacyNote";
import { CvdExplainer } from "@/components/CvdExplainer";

// 授業資料（Googleドライブ）。
const LESSON_MATERIALS_URL =
  "https://drive.google.com/drive/folders/100S4dN10iZHWCT5T-Upiichxg2sGmaEt?usp=share_link";

// 各ステップの操作画面。SPEC §1「各ステップの画面構成」の順に上から縦に並べる。
export function StepContent({ step }: { step: StepMeta }) {
  switch (step.id) {
    case "step1":
      return (
        <div className="space-y-4">
          {/* 授業資料リンク（冒頭） */}
          <a
            href={LESSON_MATERIALS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-muted"
          >
            <span aria-hidden>📎</span>
            授業資料
            <span aria-hidden className="ml-auto text-xs text-muted-foreground">
              Googleドライブ ↗
            </span>
          </a>

          {/* 1. イントロ動画（3分） */}
          <p className="text-sm">
            祖父（68歳・色覚多様性・老眼）のための家族アルバムサイトを設計します。まず導入動画を見ましょう（約3分）。
          </p>
          <VideoPlayer videoId={VIDEOS.intro.id} youtubeId={VIDEOS.intro.youtubeId} />

          {/* 2. 基発問 ＋ 3. 入力欄（notes に保存） */}
          <div className="space-y-1 rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">基発問</p>
            <p>
              みなさんが普段スマートフォンやWebサイトを使っていて、「見にくいな」「使いにくいな」と感じた経験はありませんか？
            </p>
          </div>
          <NoteField
            id="step1-experience"
            label="あなたの経験（1〜2文）"
            placeholder="例：暗い背景に細い文字で読みにくかった　など"
          />

          {/* 4. 橋渡し文 */}
          <p className="text-sm leading-relaxed">
            もし自分の家族や友人が、自分とは違う見え方をしていたら、その人にはどう見えているでしょうか。今日は、ある架空の祖父を題材にして考えていきます。
          </p>

          {/* 5. 祖父紹介動画（5分） */}
          <p className="text-sm text-muted-foreground">
            祖父を紹介する動画です（約5分）。
          </p>
          <VideoPlayer
            videoId={VIDEOS.grandfather_intro.id}
            youtubeId={VIDEOS.grandfather_intro.youtubeId}
          />

          {/* 6. 指示 */}
          <p className="text-sm leading-relaxed">
            今日は、あなたの祖父にとってのアルバムサイトを考えます。祖父がどんな人なのかを知った上で、次の動画で祖父の見え方をくわしく学びましょう。
          </p>
        </div>
      );
    case "step2":
      return (
        <div className="space-y-4">
          <p className="text-sm">
            動画①「祖父の見え方を知ろう」を見ましょう（約5分）。
          </p>
          <VideoPlayer
            videoId={VIDEOS.video1.id}
            youtubeId={VIDEOS.video1.youtubeId}
          />
        </div>
      );
    case "step3":
      return (
        <div className="space-y-6">
          <p className="text-sm">
            シミュレータで、祖父の見え方を体験してみましょう。
          </p>
          <CvdExplainer />
          <ColorBlindSimulator />
          <PrivacyNote />
          <NoteField
            id="step3-note"
            label="気づきメモ（1〜2文）"
            placeholder="シミュレータを体験して気づいたこと"
          />
        </div>
      );
    case "step4":
      return (
        <div className="space-y-4">
          <p className="text-sm">
            動画②「WCAGとデザインの原則」を見ましょう（約5分）。
          </p>
          <VideoPlayer
            videoId={VIDEOS.video2.id}
            youtubeId={VIDEOS.video2.youtubeId}
          />
          {/* 主発問 */}
          <div className="space-y-1 rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">主発問</p>
            <p className="leading-relaxed">
              数字を満たしたデザインが、必ずしも「その人に届く」とは限りません。本当に祖父に届くデザインとは、どのようなものだと思いますか？　次の演習で、この問いを意識しながら配色を作ってみてください。
            </p>
          </div>
        </div>
      );
    case "step5":
      return (
        <div className="space-y-4">
          <p className="text-sm">
            祖父のためのアルバムサイトの配色を設計しましょう。下のボタンから配色エディタ（大きい画面）を開いて、設計・AI相談・提出を行います。
          </p>
          <PrivacyNote />
          <Link
            href="/design"
            className="flex items-center justify-between gap-3 rounded-lg border bg-muted/50 px-5 py-4 font-medium hover:bg-muted"
          >
            <span>🎨 配色エディタを開く（大きい画面で編集）</span>
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            提出したら、このページに戻って「完了して次へ」を押してください。
          </p>
        </div>
      );
    case "step6":
      return (
        <div className="space-y-8">
          <section className="space-y-3">
            <h3 className="font-semibold">サンプル作品</h3>
            <p className="text-sm">
              他の人は祖父のためにどんなデザインを考えたでしょうか。3つの作品を見てみましょう。
            </p>
            <WorkGallery filter="sample" />
          </section>
          <section className="space-y-3">
            <h3 className="font-semibold">みんなの作品</h3>
            <p className="text-sm text-muted-foreground">
              クラスのみんなが提出して「公開」にした作品です。気づいたことをコメントで伝え合いましょう。
            </p>
            <WorkGallery filter="public" />
          </section>
        </div>
      );
    case "step7":
      return (
        <div className="space-y-4">
          <p className="text-sm">
            まとめ動画を見て、学習を振り返りましょう（約2分）。
          </p>
          <VideoPlayer
            videoId={VIDEOS.video3.id}
            youtubeId={VIDEOS.video3.youtubeId}
          />
          <ReflectionForm />
          <ReferenceLinks />
        </div>
      );
    default:
      return null;
  }
}

// STEP7 の参考文献リンク（SPEC §1 STEP7-3）。
function ReferenceLinks() {
  const refs = [
    { label: "WebAIM Million Report", url: "https://webaim.org/projects/million/" },
    {
      label: "カラーユニバーサルデザイン機構（CUDO）",
      url: "https://cudo.jp/",
    },
    {
      label: "WCAG 2.2（日本語訳・WAIC）",
      url: "https://waic.jp/translations/WCAG22/",
    },
  ];
  return (
    <div className="space-y-2 rounded-md border p-4">
      <p className="text-sm font-medium">参考文献</p>
      <ul className="space-y-1 text-sm">
        {refs.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              {r.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

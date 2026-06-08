import Image from "next/image";
import { ALBUM_PHOTOS } from "@/lib/albumPhotos";
import { AlbumPhoto } from "@/components/AlbumPhoto";
import { resolveFontFamily } from "@/lib/design";
import type { DesignData } from "@/lib/types";

// 各写真に付けるカテゴリタグ（色は design.tag1..3）。
function tagsOf(design: DesignData) {
  return [
    { label: "家族", color: design.tag1 },
    { label: "旅行", color: design.tag2 },
    { label: "お祝い", color: design.tag3 },
  ];
}

const COMMENTS = [
  { name: "あきこ", text: "素敵な一枚！おじいちゃん、いい笑顔だね。" },
  { name: "たろう", text: "また来年もみんなで行こうね。" },
];

// DesignData（配色・文字サイズ・フォント）を反映した「祖父のフォト」（Googleフォト風）のモック。
// titleHref を渡すとアプリ名がリンクになる。
// 親に CVD フィルタがかかっていれば、この配色も色覚シミュレーションされる。
export function DesignedAlbum({
  design,
  titleHref,
}: {
  design: DesignData;
  titleHref?: string;
}) {
  const tags = tagsOf(design);
  const appName = "おもいでフォト";

  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{
        backgroundColor: design.bg,
        color: design.text,
        fontSize: `${design.fontSize}px`,
        fontFamily: resolveFontFamily(design.fontFamily),
      }}
    >
      {/* 上部アプリバー */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          backgroundColor: design.surface,
          borderBottom: `1px solid ${design.text}22`,
        }}
      >
        {titleHref ? (
          <a
            href={titleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[1.1em] font-bold underline-offset-4 hover:underline"
            style={{ color: design.heading }}
          >
            {appName} ↗
          </a>
        ) : (
          <span
            className="shrink-0 text-[1.1em] font-bold"
            style={{ color: design.heading }}
          >
            {appName}
          </span>
        )}
        <span
          className="ml-1 hidden flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-[0.78em] sm:flex"
          style={{ backgroundColor: `${design.text}10`, color: `${design.text}99` }}
        >
          <span aria-hidden>🔍</span>写真を検索
        </span>
        <span
          className="ml-auto grid size-7 shrink-0 place-items-center rounded-full text-[0.8em] font-bold"
          style={{ backgroundColor: design.accent, color: design.bg }}
          aria-hidden
        >
          祖
        </span>
      </div>

      {/* 日付セクション＋写真グリッド */}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <p
            className="text-[0.85em] font-medium"
            style={{ color: design.heading }}
          >
            2024年6月 ・ 京都
          </p>
          <span className="text-[0.75em]" style={{ color: `${design.text}99` }}>
            すべて選択
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {ALBUM_PHOTOS.map((src, i) => {
            const tag = tags[i % tags.length];
            return (
              <div key={i} className="relative">
                <AlbumPhoto src={src} />
                <span
                  className="absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[0.6em] font-semibold text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.label}
                </span>
                {i === 1 && (
                  <span
                    className="absolute bottom-1 right-1.5 text-[0.9em] leading-none"
                    style={{ color: design.accent }}
                    aria-hidden
                  >
                    ♥
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ピックアップ（写真の詳細：キャプション＋タグ＋コメント） */}
      <div className="space-y-2 p-4 pt-0">
        <p className="text-[0.85em] font-medium" style={{ color: design.heading }}>
          ピックアップ
        </p>
        <div
          className="overflow-hidden rounded-lg"
          style={{
            backgroundColor: design.surface,
            border: `1px solid ${design.text}14`,
          }}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={ALBUM_PHOTOS[5]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2 p-3">
            <p
              className="text-[1.05em] font-bold"
              style={{ color: design.heading }}
            >
              京都の桜、満開でした
            </p>
            <p className="text-[0.8em]" style={{ color: `${design.text}99` }}>
              2024年4月6日 ・ 京都市
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t.label}
                  className="rounded-full px-2 py-0.5 text-[0.7em] font-semibold text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.label}
                </span>
              ))}
            </div>
            <p className="text-[0.8em] font-medium" style={{ color: design.accent }}>
              ♥ 3人がいいねしました
            </p>
            <div className="space-y-1.5">
              {COMMENTS.map((c) => (
                <div
                  key={c.name}
                  className="rounded-lg px-3 py-2 text-[0.8em] leading-relaxed"
                  style={{ backgroundColor: design.commentBg }}
                >
                  <span className="font-semibold" style={{ color: design.heading }}>
                    {c.name}
                  </span>
                  ：{c.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span
                className="flex-1 rounded-full px-3 py-1.5 text-[0.78em]"
                style={{
                  backgroundColor: `${design.text}10`,
                  color: `${design.text}99`,
                }}
              >
                コメントを追加…
              </span>
              <span
                className="rounded-full px-3 py-1.5 text-[0.78em] font-semibold"
                style={{ backgroundColor: design.button, color: design.buttonText }}
              >
                送信
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 下部ナビ */}
      <div
        className="flex items-center justify-around px-4 py-2 text-[0.72em]"
        style={{
          backgroundColor: design.surface,
          borderTop: `1px solid ${design.text}22`,
        }}
      >
        <span style={{ color: design.heading }}>● フォト</span>
        <span style={{ color: `${design.text}99` }}>▢ アルバム</span>
        <span style={{ color: `${design.text}99` }}>⤴ 共有</span>
      </div>
    </div>
  );
}

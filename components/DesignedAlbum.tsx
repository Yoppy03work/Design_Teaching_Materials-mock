import { ALBUM_PHOTOS } from "@/lib/albumPhotos";
import { AlbumPhoto } from "@/components/AlbumPhoto";
import type { DesignData } from "@/lib/types";

// DesignData（配色・文字サイズ）を反映した祖父のアルバムサイトのモック。
// titleHref を渡すと「家族のアルバム」見出しがリンクになる。
// 親に CVD フィルタがかかっていれば、この配色も色覚シミュレーションされる。
export function DesignedAlbum({
  design,
  titleHref,
}: {
  design: DesignData;
  titleHref?: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{
        backgroundColor: design.bg,
        color: design.text,
        fontSize: `${design.fontSize}px`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
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
            className="text-[1.15em] font-bold underline-offset-4 hover:underline"
            style={{ color: design.heading }}
          >
            家族のアルバム ↗
          </a>
        ) : (
          <span
            className="text-[1.15em] font-bold"
            style={{ color: design.heading }}
          >
            家族のアルバム
          </span>
        )}
        <span
          className="rounded-full px-2 py-0.5 text-[0.72em] font-semibold"
          style={{ backgroundColor: design.accent, color: design.bg }}
        >
          NEW
        </span>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-[1em] leading-relaxed">
          いちばん新しい思い出をここに。大きな文字と高いコントラストで、祖父にも見やすく。
        </p>
        <div className="grid grid-cols-3 gap-2">
          {ALBUM_PHOTOS.map((src, i) => (
            <AlbumPhoto key={i} src={src} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span
            className="rounded-lg px-4 py-2 text-[0.95em] font-semibold"
            style={{ backgroundColor: design.button, color: design.buttonText }}
          >
            写真を追加
          </span>
          <span
            className="text-[0.95em] font-medium underline"
            style={{ color: design.accent }}
          >
            すべて見る
          </span>
        </div>
      </div>
    </div>
  );
}

import { ALBUM_PHOTOS } from "@/lib/albumPhotos";
import { AlbumPhoto } from "@/components/AlbumPhoto";

// シーン色（赤緑の混同が見えるよう複数の有彩色を含める）
const SCENE = {
  important: "#D32F2F", // 赤
  done: "#388E3C", // 緑
  info: "#1976D2", // 青
  warn: "#F9A825", // 黄
};

// 祖父の家族アルバムサイトのモック。
// titleHref を渡すと「家族のアルバム」見出しがその別ページへのリンクになる。
export function AlbumScene({ titleHref }: { titleHref?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white text-neutral-900 shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        {titleHref ? (
          <a
            href={titleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold underline-offset-4 hover:underline"
          >
            家族のアルバム ↗
          </a>
        ) : (
          <span className="text-lg font-bold">家族のアルバム</span>
        )}
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: SCENE.important }}
        >
          重要
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Tag color={SCENE.important} label="重要" />
          <Tag color={SCENE.done} label="完了" />
          <Tag color={SCENE.info} label="お知らせ" />
          <Tag color={SCENE.warn} label="注意" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALBUM_PHOTOS.map((src, i) => (
            <AlbumPhoto key={i} src={src} />
          ))}
        </div>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: SCENE.done }}
        >
          写真を追加
        </button>
      </div>
    </div>
  );
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

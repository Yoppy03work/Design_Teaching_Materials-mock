import Image from "next/image";
import { cn } from "@/lib/utils";

// アルバムの写真タイル（正方形・object-cover）。
// 親に CVD フィルタがかかっていれば写真も色覚シミュレーションされる。
export function AlbumPhoto({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md bg-muted",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 33vw, 160px"
        className="object-cover"
      />
    </div>
  );
}

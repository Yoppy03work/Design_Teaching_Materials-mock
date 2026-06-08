import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// カスタム404ページ。
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-3xl font-bold">404</p>
      <h1 className="text-lg font-semibold">ページが見つかりません</h1>
      <p className="text-sm text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/lesson" className={cn(buttonVariants())}>
        レッスンへ戻る
      </Link>
    </div>
  );
}

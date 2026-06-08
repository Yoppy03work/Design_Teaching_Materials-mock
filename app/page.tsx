import { redirect } from "next/navigation";

// ランディング: 認証は Phase 8 まで後回しのため、そのまま学習フローへ送る。
// 認証導入後はここで未ログイン判定 → /login へ振り分ける。
export default function Home() {
  redirect("/lesson");
}

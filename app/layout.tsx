import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// アプリ全体の基本フォント（--font-sans を Noto Sans JP に）。
// 日本語グリフは大きいため preload せず、display: swap で表示。
const notoSansJp = Noto_Sans_JP({
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "アクセシブルなデザイン｜情報I 教材",
  description:
    "高校情報I「コミュニケーションと情報デザイン」非同期オンライン授業の学習教材。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

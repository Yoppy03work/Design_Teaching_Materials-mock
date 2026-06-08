# アクセシブルなデザイン学習教材（mock）

高校情報I「コミュニケーションと情報デザイン」の非同期オンライン授業用 Web アプリ。
共通ペルソナ「祖父」（68歳・色覚多様性・老眼）のためのアルバムサイトの配色を、
動画 → 配色演習 → 作品ライブラリ → 振り返り の流れで設計する。

## 技術スタック

- Next.js 15 (App Router) / TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres) — **認証は Phase 8 まで後回し**
- Anthropic SDK（Phase 4 のAI壁打ち。サーバー側のみ）

## 認証・認可は後回し

教材の中身を先に作り、デモを最優先するため、認証(Google OAuth)・RLS・教師ロールは
**Phase 8 まで導入しない**。後付けで「作り直しにならない」よう、2つのシームを用意している。

1. **`lib/auth/useCurrentUser.ts`** — 身元の唯一の出入口。今は固定のデモユーザーを返す。
   Phase 8 でこの中身を Supabase Auth のセッション読み取りに差し替えるだけで全体が認証対応になる。
2. **`lib/repo/*`** — データ操作は全てここ経由で、`userId` を引数で受け取る。
   アプリ側に `auth.uid()` を埋め込まないので、Phase 8 で RLS を有効化しても無改修。

補助として、RLS ポリシーは `supabase/phase8_rls.sql` に**設計だけ前倒しで記述**し、
有効化は Phase 8 に回している。`user_id` 系は当面 `auth.users` ではなく `profiles(id)` を参照する
（認証ユーザーが居なくても insert できるようにするため）。

設計の詳細は [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) を参照。

## セットアップ

```bash
npm install
cp .env.example .env.local   # 値を埋める（未設定でも起動はする）
npm run dev                  # http://localhost:3000 → /lesson へリダイレクト
```

### Supabase（データ永続化に必要）

1. Supabase プロジェクトを作成し、`.env.local` に URL / anon key を設定。
2. `supabase/migrations/0001_initial.sql` → `0002_seed.sql` の順に SQL を適用
   （Supabase SQL Editor へ貼り付け、または `supabase db push`）。
3. RLS（認可）は `supabase/phase8_rls.sql` に分離してある（`migrations/` の外なので
   `supabase db push` では流れない）。**Phase 8 まで適用しない**。

> 環境変数が未設定でもトップページとレッスン概要は表示される。
> データの読み書きを行う画面（Phase 1 以降）には Supabase 接続が必要。

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番起動 |
| `npm run lint` | ESLint |

## 実装フェーズ

Phase 0（本PR）: 初期化＋認証後回しの抽象化シーム。
Phase 1〜7: レッスン骨格 → WCAG/配色エディタ → 色覚シミュレータ → AI壁打ち →
作品ライブラリ/提出 → 振り返り/動画 → 仕上げ（ここまで認証ゼロでデモ可能）。
Phase 8: 認証・RLS・教師管理画面の後付け。

## ブランチ運用

`main` / `develop` へ直接 push しない。作業ブランチを切って PR を出し、
Codex レビューが OK ならマージする。

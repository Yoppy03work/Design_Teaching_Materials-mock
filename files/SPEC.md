# アクセシブルなデザイン学習教材 — プログラム仕様書

> 高校情報I「コミュニケーションと情報デザイン」第4時の非同期型オンライン授業用Webアプリ。
> このドキュメントは実装の現状に合わせて更新した仕様書です。
>
> **重要な前提（現行フェーズ）**：認証・認可・教師画面は **Phase 8 まで後回し**。
> 現在は **無認証＋固定デモユーザー**で動作し、Supabase 接続時のみ永続化する
> （未接続でもセッション内で動く）。詳細な進め方は `docs/IMPLEMENTATION_PLAN.md` を参照。

---

## 1. プロジェクト概要

### 目的
高校1年生が、共通ペルソナ「祖父」（68歳・色覚多様性=赤緑色弱・老眼）のためのアルバムサイトの配色を設計する。動画視聴 → 配色演習 → 作品ライブラリ閲覧 → 振り返り、という流れを非同期で進める。

### 学習フロー（教材の画面遷移）
```
[STEP1] 導入（授業資料 + イントロ動画 + 基発問 + 祖父紹介動画）
  ↓
[STEP2] 動画①「祖父の見え方」
  ↓
[STEP3] 演習①色覚シミュレータ体験 + 気づきメモ
  ↓
[STEP4] 動画②「WCAGとデザインの原則」 + 主発問
  ↓
[STEP5] 演習②配色エディタで設計 + WCAG確認 + 提出（AI壁打ち併用）
  ↓
[STEP6] 作品ライブラリでサンプル3作品を閲覧 + コメント
  ↓
[STEP7] 振り返り3問（書き出しヒント付き）+ まとめ動画 + 参考文献
  ↓
完了
```
> 認証フロー（ログイン）は Phase 8 まで未導入。`/` は `/lesson` へ。

### 各ステップの画面構成（上から順に縦に並べる）

各ステップページ（`/lesson/step/[stepId]`）は、以下の要素を**記載順に上から縦に配置**する。各ステップ末尾に共通の「← 前へ / 完了して次へ →」ナビ（`StepView`）。

**STEP1 導入**
1. 授業資料リンク（Googleドライブ・別タブ、表示「授業資料」）
2. イントロ動画（VideoPlayer、video_id='intro'）
3. 基発問の説明ブロック：「みなさんが普段スマートフォンやWebサイトを使っていて、『見にくいな』『使いにくいな』と感じた経験はありませんか？」
4. 経験記入の入力欄（NoteField、notes テーブルに保存）
5. 橋渡し文：「もし自分の家族や友人が、自分とは違う見え方をしていたら、その人にはどう見えているでしょうか。今日は、ある架空の祖父を題材にして考えていきます。」
6. 祖父紹介動画（VideoPlayer、video_id='grandfather_intro'）
7. 指示：「今日は、あなたの祖父にとってのアルバムサイトを考えます。祖父がどんな人なのかを知った上で、次の動画で祖父の見え方をくわしく学びましょう。」

**STEP2 動画①**
1. 動画①「祖父の見え方を知ろう」（VideoPlayer、video_id='video1'）

**STEP3 演習①（色覚体験）**
1. 短い導入テキスト
2. 色覚のしくみ解説（CvdExplainer）
3. ColorBlindSimulator（P/D/T型切替、程度スライダー、「自分／祖父の見え方」トグル、Machado vs Brettel 比較、アルバムシーンに適用）
4. プライバシー注意（PrivacyNote）
5. 気づきメモの入力欄（NoteField、notes テーブルに保存）

**STEP4 動画②**
1. 動画②「WCAGとデザインの原則」（VideoPlayer、video_id='video2'）
2. 主発問の説明ブロック：「数字を満たしたデザインが、必ずしも『その人に届く』とは限りません。本当に祖父に届くデザインとは、どのようなものだと思いますか？　次の演習で、この問いを意識しながら配色を作ってみてください。」

**STEP5 演習②（配色設計・本時の中心）**
1. 課題テキスト
2. プライバシー注意（PrivacyNote）
3. 「配色エディタを開く」ボタン → 全幅の編集ページ `/design` へ遷移して設計・提出
   - `/design`：ColorEditor（左コントロール＋大きいプレビュー DesignedAlbum）＋ ContrastChecker ＋ 設計意図メモ ＋ 提出（WorkSubmitForm）＋ AI壁打ち（AIAssistant）

**STEP6 作品ライブラリ**
1. 導入テキスト
2. WorkGallery（filter='sample'、サンプル3作品＝機能・感情・対話）
3. 各 WorkCard：配色プレビュー・哲学タグ・最小コントラスト・文字サイズ。**カードを押すと `/works/[id]` でその配色のページを開ける**
4. コメント記入（comments テーブルに保存）

**STEP7 振り返り＋まとめ**
1. まとめ動画（VideoPlayer、video_id='video3'）
2. ReflectionForm（3問、書き出しヒントを placeholder 表示、reflections に保存）
3. 参考文献リンク（WebAIM Million／CUDO／WCAG 2.2 日本語訳）

> 動画ID対応表：intro＝教師イントロ、grandfather_intro＝祖父紹介、video1＝動画①見え方、video2＝動画②WCAG、video3＝まとめ動画。計5本（現状はプレースホルダYouTube）。

### 補助ページ（仕様書からの追加実装）
- `/album`：祖父のアルバムサイトを全幅で開く独立ページ（色覚コントロール付き、デモ配色）。STEP3/STEP5 の「家族のアルバム」見出しからリンク。
- `/design`：配色エディタを全幅で開く独立ページ（左コントロール＋大きいプレビュー、AI壁打ち＋提出）。STEP5 のボタンから遷移。
- `/works/[id]`：作品（その配色）でアルバムを全幅表示。色覚トグル＋コントラスト表示。
- `/lab/*`：各部品の開発プレビュー。
- Chrome 拡張（`extension/`）：任意ページに色覚シミュレーションを適用。

---

## 2. 技術スタック

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS + shadcn/ui（base-ui） |
| 認証 | **Phase 8 まで後回し**（導入時は Supabase Auth / Google OAuth を想定） |
| DB | Supabase Postgres（**無認証フェーズは RLS 無効**。Phase 8 で `supabase/phase8_rls.sql` を適用） |
| AI | Anthropic SDK（`claude-haiku-4-5`、`/api/ai` のサーバー側のみ） |
| 動画 | YouTube限定公開の埋め込み（react-youtube） |
| ホスティング | Vercel（想定） |

### 環境変数（`.env.example`）
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # サーバー処理用（ai_logs 等）
ANTHROPIC_API_KEY=           # /api/ai でのみ使用、クライアントに露出させない
```
> いずれも未設定でもアプリは起動する（永続化のみ無効化され、セッション内で動作）。

---

## 3. ディレクトリ構成（現状）

```
app/
├── layout.tsx / page.tsx（→ /lesson）/ error.tsx / not-found.tsx / loading.tsx
├── lesson/
│   ├── layout.tsx              # ProgressProvider > WorksProvider, 進捗バー＋ナビ
│   ├── page.tsx                # ステップ一覧 / 続きから
│   └── step/[stepId]/page.tsx  # 各ステップ（StepView → StepContent で出し分け）
├── album/page.tsx              # 祖父のアルバムサイト（全幅・色覚体験）
├── works/[id]/page.tsx         # 作品の配色ページ（色覚トグル＋コントラスト）
├── lab/*                       # 開発プレビュー
└── api/ai/route.ts             # AI壁打ち（Claude Haiku）

components/
├── VideoPlayer / ColorEditor / ContrastChecker / ColorBlindSimulator / CvdControls
├── CvdExplainer / DesignedAlbum / AlbumScene / AlbumPhoto
├── AIAssistant / WorkGallery / WorkCard / WorkSubmitForm / WorksProvider
├── ReflectionForm / NoteField / PrivacyNote / ProgressBar / ProgressProvider / StepView / StepContent

lib/
├── supabase/{client,server}.ts
├── auth/{useCurrentUser,constants}.ts   # 固定デモユーザー（認証後回しのシーム）
├── repo/*.ts                            # データ操作（userId は引数）
├── wcag.ts / colorblind.ts / colorblind-data.ts / design.ts
├── steps.ts / videos.ts / albumPhotos.ts / sampleWorks.ts / types.ts

supabase/
├── migrations/0001_initial.sql / 0002_seed.sql
└── phase8_rls.sql              # RLS（Phase 8 で適用。migrations の外）
```
> 教師画面（`/teacher`）・`/login`・認証ミドルウェアは Phase 8。

---

## 4. データベーススキーマ（現行・認証後回し版）

認証後回しのため、`user_id` 系は `auth.users` ではなく **`profiles(id)`** を参照する（認証ユーザーが居なくても挿入できるようにするため）。Phase 8 で `profiles` を `auth.users` と連携させる。テーブルは `profiles / progress / video_logs / works / notes / comments / reflections / ai_logs / feedbacks` の9つ（定義は `supabase/migrations/0001_initial.sql`）。

`works.design_data`（jsonb）の現行フィールド：
```jsonc
{
  "bg", "text", "surface", "heading",       // 背景・文字・バー/カード・見出し
  "button", "buttonText", "accent",         // ボタン・ボタン文字・アクセント
  "tag1", "tag2", "tag3",                    // カテゴリタグ色
  "commentBg",                              // コメント吹き出し背景
  "fontSize",                               // 本文サイズ(px)
  "fontFamily"                              // "sans" | "serif" | "rounded"
}
```

### RLS
- **現行フェーズは RLS 無効**（anon キーで読み書き）。そのため**実在の個人情報を入力しないデモ運用に限定**。
- Phase 8 で `supabase/phase8_rls.sql`（RLS有効化＋本人スコープ・教師ロール・サンプル全員可・公開ピア閲覧などのポリシー）を適用する。

---

## 5. 機能仕様

### 5.1 ColorEditor（配色エディタ）
- 入力（グループ別、各色は専用ピッカー＋HEX）：
  - 基本：背景・文字・見出し・バー/カード(surface)・ボタン・ボタン文字・アクセント
  - タグ（カテゴリ）：tag1/tag2/tag3
  - コメント：吹き出し背景(commentBg)
- 文字：フォント（ゴシック体／明朝体／丸ゴシック）＋ 文字サイズ（14–28px）
- プレビュー：DesignedAlbum（Googleフォト風）に配色・文字サイズ・フォントをリアルタイム反映
- プリセット：高コントラスト／機能優先／感情優先／対話優先
- 出力：`design_data`(jsonb)

### 5.2 ContrastChecker（WCAGコントラスト比）
- `lib/wcag.ts`：相対輝度、コントラスト比 =(L1+0.05)/(L2+0.05)
- 色ペア：本文（背景×文字）／見出し帯（帯×見出し）／ボタン／アクセント／コメント（吹き出し×文字）
- 判定バッジ：AAA（7:1）/ AA（4.5:1）/ 大字AA（3:1）/ **要改善**（未満。※「失格」から表現を変更、色も中立）
- リアルタイム更新

### 5.3 ColorBlindSimulator（色覚多様性シミュレータ）
- `lib/colorblind.ts`：**Machado 2009（程度つき・主）** ＋ **Brettel 1997（完全二色覚・T型も正確）** を併用
- P/D/T型切替、程度スライダー、「自分／祖父の見え方」トグル
- SVG `feColorMatrix`（線形RGBで適用）でアルバムシーン・写真に反映

### 5.4 AIAssistant（AI壁打ち）
- チャットUI、`/api/ai` 経由で Claude Haiku 4.5（APIキーはサーバー側のみ）
- システムプロンプトは「6. AIプロンプト設計」参照、会話履歴は `ai_logs` に保存

### 5.5 WorkGallery / WorkCard（作品ライブラリ）
- WorkGallery props：`filter`（'sample' | 'all'）。STEP6 は 'sample'
- WorkCard：配色プレビュー・哲学タグ・最小コントラスト・文字サイズ・タグ色ドット。**押すと `/works/[id]`**（その配色のページ＋色覚トグル）
- コメントは `comments` に保存

### 5.6 ReflectionForm（振り返り）
- 3問・書き出しヒント（placeholder）、`reflections` に保存＋STEP7完了

### 5.7 VideoPlayer
- react-youtube、`onStateChange` で `video_logs.watch_ratio` 更新（Supabase接続時）

### 5.8 教師管理画面（/teacher）— Phase 8（後回し）

---

## 6. AIプロンプト設計

`/api/ai/route.ts` のシステムプロンプト（要点）：
```
あなたは高校情報I「アクセシブルなデザイン」教材の壁打ち相手です。
共通ペルソナ「祖父」（68歳・赤緑色弱・老眼）のためのアルバムサイトの配色を、
高校1年生が設計しています。
- 答えを直接示さず、生徒自身に考えさせる（HEX値を指定しない）。
- 「祖父の視点ではどう見えるか？」と問い返す。
- 機能優先・感情優先・対話を通じた最適化など複数の方向性を示す。
- 200字以内、優しく、最後は「あなたはどう思う？」で締める。
- 個人を特定する情報には触れない。
```
呼び出し：`model: "claude-haiku-4-5"`, `max_tokens: 300`, `system`, `messages`（往復履歴）。

---

## 7. 実装フェーズ

`docs/IMPLEMENTATION_PLAN.md` を正とする（認証後回し版）。Phase 0〜7 で学習フローを先に完成させ、**Phase 8 で認証・認可・教師画面・RLS を後付け**する。`useCurrentUser()` と `repo/*`（userId 引数）の2つの抽象化により、Phase 8 は最小差分で移行できる。

---

## 8. 注意点

- **APIキーは絶対にクライアントに露出させない**。AI呼び出しは必ず `/api/ai` 経由。
- **個人情報**：ペルソナは架空。入力欄に「実在の家族情報を入力しない」注意書きを表示。現行は RLS 無効のためデモ運用限定。
- **写真素材**：本教材では **AI生成のサンプル写真**（`public/album/`）を使用。実在の人物ではない。
- **作品の公開**：生徒作品は `is_public=true` のみライブラリ表示（既定は非公開）。
- **localStorage / sessionStorage は使わない**：状態は React state と Supabase（未接続時はセッション内メモリ）で管理。
- **色覚変換行列**：Machado 2009 ＋ Brettel 1997。出典は `lib/colorblind*.ts` にコメントで明記。

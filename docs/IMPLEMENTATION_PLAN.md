# 実装プラン — アクセシブルなデザイン学習教材（認証後回し版）

> 元仕様書（`プログラム仕様書`）の実装計画。**認証・認可を Phase 8 まで後回し**にし、
> 学習フロー（STEP1〜7）を先に完成・デモ可能にする。色覚シミュレータは
> **Machado 2009 を主軸＋Brettel 1997 併用**にアップグレードする。

---

## Context（なぜこの計画か）

- リポジトリはグリーンフィールド（既存コードなし。`*.tex` の指導案のみ）。ゼロから構築する。
- 目的は**教職発表のデモを最優先**すること。Google OAuth・RLS・教師ロールのセットアップ摩擦を避け、
  教材の中身（配色エディタ／WCAG／色覚シミュレータ／AI壁打ち／振り返り／作品ライブラリ）を先に動かす。
- ただし「後で認証を足すときに作り直しにならない」ことを設計で担保する（下記 2つの抽象化）。
- 色覚変換は、ペルソナが「赤緑**色弱**（＝異常三色覚／程度のある部分的欠如）」であることに合わせ、
  **程度(severity)を 0–100% で表現できる Machado 2009** を主軸に採用する。

## 確定した方針

| 項目 | 決定 |
|---|---|
| データ保存 | **Supabase Postgres（認証なし）**。RLSは無効、固定デモユーザーIDで保存。リロードで残る。 |
| 色覚手法 | **Machado 2009 主軸**（程度スライダー）＋**Brettel 1997 併用**（完全二色覚／T型の極端表示） |
| 色変換の適用 | **SVG `feColorMatrix` + `color-interpolation-filters="linearRGB"`**（線形RGBで適用＝Web頻出のガンマバグ回避） |
| localStorage | **使わない**（仕様準拠）。状態は React state ＋ Supabase。 |
| 教師画面 | Phase 8（認証）に同梱。 |

---

## 認証後回しを成立させる 2つの抽象化（最重要）

後付け認証を「差し替え」だけで済ませるため、身元とデータ操作にシームを作る。

### ① 身元の唯一の出入口 `useCurrentUser()`
コンポーネントは Supabase Auth を直接触らない。当面はデモユーザーを返し、Phase 8 で中身だけ差し替える。

```ts
// lib/auth/useCurrentUser.ts （Phase 0）
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'; // 固定UUID
export function useCurrentUser() {
  // Phase 8 で Supabase Auth セッション読み取りに差し替える唯一の箇所
  return { id: DEMO_USER_ID, displayName: 'デモ生徒', role: 'student' as const };
}
```

### ② データ操作はリポジトリ関数経由・`userId` は引数で受ける
アプリ側に `auth.uid()` を埋め込まない。Phase 8 で RLS が効き始めても**この層は無改修**。

```ts
// lib/repo/works.ts など（Phase 0以降で各機能ごとに追加）
export async function submitWork(userId: string, designData: DesignData,
  intentMemo: string, wcagScore: number): Promise<Work> { /* supabase insert */ }
export async function listWorks(opts: { filter: 'sample' | 'all' }): Promise<Work[]> { /* ... */ }
```

主なリポジトリ関数（各 `userId` 引数）:
`getProgress / completeStep`、`listWorks / getWork / submitWork`、`saveNote / listNotes`、
`saveReflection / getReflection`、`logAi / listAiLogs`、`addComment / listComments`。

### 補助ルール
- **RLSポリシーのSQLは Phase 0 で書いておくが、有効化は Phase 8**（設計は前倒し・強制だけ後回し）。
- **FK を `auth.users` に貼らない**（認証ユーザーが居ないと insert できないため）。
  `profiles` を自前のユーザー表とし、`user_id` 系は `profiles(id)` を参照。デモ profile を1行 seed する。
  Phase 8 で `profiles` を `auth.users` と連携（トリガ or FK追加）させる＝最小差分。

---

## ディレクトリ（仕様書からの差分）

仕様書の構成を踏襲。認証後回しに伴う追加・変更のみ記載：

```
lib/
├── auth/useCurrentUser.ts      # 【追加】身元シーム（Phase 0）
├── repo/                       # 【追加】データ操作層（userId引数）
│   ├── progress.ts  works.ts  notes.ts  reflections.ts  aiLogs.ts  comments.ts
├── supabase/
│   ├── client.ts  server.ts    # 使う
│   └── middleware.ts           # 【Phase 8まで no-op / 不使用】
├── wcag.ts  colorblind.ts  types.ts
supabase/migrations/
├── 0001_initial.sql            # テーブル（RLS無効、auth.users FKなし）
├── 0002_seed.sql               # デモprofile + サンプル作品3件
└── 0003_rls.sql                # 【Phase 8で適用】RLS有効化＋ポリシー
```

---

## フェーズ別プラン

各フェーズ＝1セッション目安。Phase 0〜7 が**認証ゼロで通しデモ可能**な MVP。

### Phase 0 — 初期化 ＋ 抽象化シーム
- Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui を作成。
- `lib/supabase/client.ts` / `server.ts` を用意（**middleware の認証は入れない**）。
- `lib/auth/useCurrentUser.ts`（デモ固定）と `lib/repo/*`（空の関数シグネチャ）を用意。
- `.env.example`（`NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `ANTHROPIC_API_KEY`）。
- `supabase/migrations/0001_initial.sql`：仕様書スキーマを **RLS無効・auth.users FKなし** で作成。
  `user_id` 系は `profiles(id)` 参照に変更。`0002_seed.sql` でデモ profile を1行投入。

### Phase 1 — レッスンの骨格・進捗・7ステップ遷移（認証なし）
- `/`（→ `/lesson` リダイレクト。/login は作らない）、`app/lesson/layout.tsx`（ProgressBar＋ステップナビ）。
- `app/lesson/page.tsx`（一覧／続きから）、`app/lesson/step/[stepId]/page.tsx`（step1〜7 出し分け）。
- `components/ProgressBar.tsx`。進捗は `repo/progress` 経由で `progress` テーブルに保存（`completeStep`）。
- 各ステップは空のプレースホルダで良い（以降のフェーズで中身を入れる）。

### Phase 2 — WCAG ＋ 配色エディタ
- `lib/wcag.ts`：相対輝度＋コントラスト比 `(L1+0.05)/(L2+0.05)`。判定 AAA(7:1)/AA(4.5:1)/大字AA(3:1)/失格。
- `components/ContrastChecker.tsx`：各色ペア（背景×文字、背景×ボタン文字…）をリアルタイム判定バッジ表示。
- `components/ColorEditor.tsx`：背景／文字／ボタン／アクセント（HEX or HSL）。プリセット数種。
  アルバムサイトのモックに配色を反映するライブプレビュー。ContrastChecker と連動。
- 出力は `DesignData`（`lib/types.ts`）。STEP5 で使用。

### Phase 3 — 色覚シミュレータ（Machado 2009 ＋ Brettel 1997）
詳細は下記「色覚シミュレータ実装メモ」参照。
- `lib/colorblind.ts`：Machado 2009 の事前計算行列（P/D/T × 程度0.0–1.0）＋ Brettel 1997（完全二色覚）。出典コメント必須。
- `components/ColorBlindSimulator.tsx`：
  - P型/D型/T型 切替、**程度スライダー（既定 ≒0.6 中程度＝祖父）**。
  - 「自分の見え方／他者の見え方」トグル（原画 ⇄ シミュレーション。ラベルで共感を促す）。
  - 「完全二色覚モード」で Brettel 1997 に切替（特に T型）。
  - 適用は SVG `feColorMatrix` + `color-interpolation-filters="linearRGB"`。

### Phase 4 — AI壁打ち
- `app/api/ai/route.ts`：Anthropic SDK、`model: "claude-haiku-4-5"`、`max_tokens: 300`。
  システムプロンプトは仕様書 §6 をそのまま使用。**APIキーはサーバー側のみ**（`NEXT_PUBLIC` 厳禁）。
- `components/AIAssistant.tsx`：チャットUI。往復履歴を `messages` で送信。
- `repo/aiLogs.logAi(userId, prompt, response)` で保存。任意でレート上限。

### Phase 5 — 作品ライブラリ ＋ 提出 ＋ コメント
- `repo/works`：`submitWork`（ColorEditor から `design_data` / `intent_memo` / `wcag_score` を保存）。
- `components/WorkCard.tsx` / `WorkGallery.tsx`（`filter='sample' | 'all'`）。本時STEP6は `'sample'`。
- `repo/comments` ＋ コメントUI。`0002_seed.sql` にサンプル3作品（機能・感情・対話）を投入。
- 認証なし期間は `is_public` 等は素通し（全件閲覧可）。公開制御は Phase 8 で RLS により実効化。

### Phase 6 — 振り返り ＋ 動画（→ 7ステップ通し動作）
- `components/ReflectionForm.tsx`：3問・書き出しヒント（placeholder、仕様書 §5.6）。`repo/reflections` 保存＋STEP7完了。
- `components/VideoPlayer.tsx`：react-youtube。`onStateChange` で `video_logs.watch_ratio` 更新（`repo` 経由）。
- ここで **STEP1→7 を通しで動作確認**（下記 Verification）。

### Phase 7 — 仕上げ（＝デモ可能マイルストーン）
- shadcn/ui テーマ統一、レスポンシブ（PC/タブレット）、エラー/ローディング状態。
- ペルソナ入力欄に個人情報の注意書き（仕様書 §9）。Vercel デプロイは任意。

### Phase 8 — 【後回し】認証・認可・教師画面（後付け）
- Supabase Auth（Google OAuth）、`/login`、`lib/supabase/middleware.ts` で未ログインを `/login` リダイレクト。
- `profiles` を `auth.users` と連携、`role`（student/teacher）。`useCurrentUser()` を**実セッションに差し替え**。
- `0003_rls.sql` を適用：works / reflections / notes / ai_logs / comments / feedbacks のRLSを有効化
  （仕様書 §4 のポリシー要点どおり）。`is_public` と提出済み条件、サンプル全員可、教師ロール全件可。
- 教師画面 `/teacher`（StudentList）・`/teacher/[studentId]`（SubmissionDetail）・`feedbacks`・Recharts でWCAG分布。
- `repo/*` は基本無改修（RLSが効くだけ）。変更点は実質「`useCurrentUser` の中身」と「ポリシーSQL適用」。

---

## 色覚シミュレータ実装メモ（`lib/colorblind.ts`）

- **Machado 2009（主軸）**：P/D/T × 程度 0.0–1.0（0.1刻みの事前計算3×3行列）。
  異常三色覚＝色弱を**唯一原理的に**表現できる。祖父の既定程度は中程度（≒0.6、調整可）。
- **Brettel 1997（併用）**：完全二色覚の定番。**T型はこれが事実上の唯一の正解**。
  分岐（2投影行列＋分離面判定）を伴うため、SVGでは「2つの`feColorMatrix` ＋ `feComponentTransfer`(discrete α) ＋ `feBlend`」で再現、
  または canvas/JS で実装。
- **ガンマ問題（必須対応）**：これらの行列は**線形RGB**で定義。Web頻出実装（Coblis旧版/Fidaner系コピペ）は
  sRGBのガンマ復号を飛ばし色が暗すぎる。→ SVGは `color-interpolation-filters="linearRGB"` をブラウザに線形化させて回避。
  canvasなら「線形化→行列→再エンコード」を自前で行う。**バグ行列を載せた npm（color-blind 等）はそのまま使わない**。
- **自分/他者トグル**：原画（自分の見え方）⇄ シミュレーション（他者＝祖父の見え方）の切替。
  共感の文脈づけが目的（逆変換＝daltonize補正は任意・スコープ外）。
- **出典コメント**（コードに明記）:
  - Machado 2009: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
  - Brettel/Viénot 比較・バグ行列警告: https://daltonlens.org/opensource-cvd-simulation/
  - 正確な SVG feColorMatrix: https://daltonlens.org/cvd-simulation-svg-filters/

---

## スキーマ／RLS の扱い

- `0001_initial.sql`：仕様書 §4 のテーブルを作成。ただし **RLS無効**、**`user_id` は `profiles(id)` 参照**（`auth.users` FK無し）。
- `0002_seed.sql`：デモ profile 1行（`DEMO_USER_ID`）＋ サンプル作品3件（type='sample', philosophy=function/emotion/dialogue）。
- `0003_rls.sql`（Phase 8 適用）：`profiles` を `auth.users` 連携化、各表 RLS 有効化、仕様書 §4 のポリシー実装。

---

## Verification（MVP通し確認 = Phase 6 完了時）

1. `npm run dev`。ログイン無しでデモユーザーとして `/lesson` に入れる。
2. STEP1→7 を順に進め、各完了で **進捗バーが進む → リロード後も保持**（Supabase永続化）。
3. STEP2/4 動画：再生で `video_logs.watch_ratio` が更新される。
4. STEP3 シミュレータ：P/D/T 切替・程度スライダーでプレビューが変化、自分/他者トグル動作、Brettel完全二色覚モード切替。
5. STEP5 エディタ：色変更で ContrastChecker バッジが即時更新（AA/AAA/失格）。**提出→`works` に1件→リロードで残る**。
6. STEP5 AI：送信で `/api/ai` が Haiku 応答→`ai_logs` に保存。**ビルド成果物/ネットワークに APIキーが出ない**ことを確認。
7. STEP6 振り返り：提出→`reflections` 保存→リロードで保持、STEP7完了。STEP6ギャラリーにサンプル3作品表示。

## リスク／注意
- **Supabase プロジェクト（無料枠）と環境変数**が必要（認証は未設定で良い）。
- **`ANTHROPIC_API_KEY` はサーバー専用**（`/api/ai` のみ。`NEXT_PUBLIC` 禁止）。
- **個人情報**：ペルソナは架空。実在家族情報を入力させない注意書きを入力欄に表示。
- **著作権**：プレビュー写真は Unsplash 等フリー素材／ダミー画像。
- RLS・公開制御・教師ロールは設計済みだが**強制は Phase 8**。それまでローカルは全件素通し。

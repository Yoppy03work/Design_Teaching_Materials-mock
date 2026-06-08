-- 0001_initial.sql
-- アクセシブルなデザイン学習教材 — 初期スキーマ
--
-- 【認証後回し方針】
--   * 認証(Supabase Auth)は Phase 8 まで導入しない。
--   * そのため user_id 系は auth.users ではなく profiles(id) を参照する
--     （認証ユーザーが居なくても insert できるようにするため）。
--   * RLS はこの段階では有効化しない（0003_rls.sql で Phase 8 に有効化）。
--   * profiles は Phase 8 で auth.users と連携させる（最小差分で移行可能）。

create extension if not exists "pgcrypto";

-- プロフィール（Phase 8 で auth.users と連携）
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz default now()
);

-- 学習進捗
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  step_id text not null,
  completed_at timestamptz default now(),
  unique (user_id, step_id)
);

-- 動画視聴ログ
create table if not exists video_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  video_id text not null,
  watch_ratio numeric default 0,
  updated_at timestamptz default now(),
  unique (user_id, video_id)
);

-- 作品ライブラリ（サンプル＋生徒作品を統合）
create table if not exists works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade, -- サンプルは null
  type text not null default 'student' check (type in ('sample', 'student')),
  philosophy text check (philosophy in ('function', 'emotion', 'dialogue')),
  persona text not null default 'grandfather',
  design_data jsonb not null,
  intent_memo text,
  wcag_score numeric,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- 演習①の気づきメモ
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  content text,
  created_at timestamptz default now()
);

-- 作品へのコメント（ピア閲覧）
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  work_id uuid not null references works (id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 振り返り
create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  answer_1 text,
  answer_2 text,
  answer_3 text,
  created_at timestamptz default now()
);

-- AI壁打ちログ
create table if not exists ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  prompt text not null,
  response text not null,
  created_at timestamptz default now()
);

-- 教師フィードバック
create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

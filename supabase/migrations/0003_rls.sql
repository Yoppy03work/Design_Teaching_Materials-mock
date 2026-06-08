-- 0003_rls.sql
-- ╔══════════════════════════════════════════════════════════════════╗
-- ║ 【Phase 8（認証導入）で適用】それまで実行しないこと。              ║
-- ╚══════════════════════════════════════════════════════════════════╝
--
-- 認証・認可を有効化する。仕様書 §4 のRLSポリシー要点を実装する。
-- 設計を前倒しで記述しておき、強制（有効化）だけ Phase 8 に回す。
--
-- 前提（Phase 8 で別途実施）:
--   * profiles を auth.users と連携させる
--     （例: profiles.id を auth.users(id) 参照に変更し、サインアップ時に行を作成）。
--   * 認証後回しフェーズの固定デモユーザー行は撤去するか、テストデータとして扱う。

-- 教師判定ヘルパ
create or replace function is_teacher() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'teacher'
  );
$$;

alter table profiles enable row level security;
alter table progress enable row level security;
alter table video_logs enable row level security;
alter table works enable row level security;
alter table notes enable row level security;
alter table comments enable row level security;
alter table reflections enable row level security;
alter table ai_logs enable row level security;
alter table feedbacks enable row level security;

-- profiles: 本人の行、教師は全員分を閲覧可
create policy "profiles_self_or_teacher_select" on profiles
  for select using (id = auth.uid() or is_teacher());
create policy "profiles_self_insert" on profiles
  for insert with check (id = auth.uid());
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid());

-- 本人スコープ＋教師閲覧の共通パターン: progress / video_logs / notes / reflections / ai_logs
create policy "progress_owner_all" on progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress_teacher_select" on progress
  for select using (is_teacher());

create policy "video_logs_owner_all" on video_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "video_logs_teacher_select" on video_logs
  for select using (is_teacher());

create policy "notes_owner_all" on notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notes_teacher_select" on notes
  for select using (is_teacher());

create policy "reflections_owner_all" on reflections
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reflections_teacher_select" on reflections
  for select using (is_teacher());

create policy "ai_logs_owner_all" on ai_logs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "ai_logs_teacher_select" on ai_logs
  for select using (is_teacher());

-- works:
--   * 自分の作品は常に閲覧/編集可
--   * サンプル(type='sample')は全員閲覧可
--   * 他人の作品は is_public=true かつ 自分が提出済み(works に自分の行がある)場合のみ閲覧可
--   * 教師は全件閲覧可
create policy "works_owner_all" on works
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "works_sample_select" on works
  for select using (type = 'sample');
create policy "works_public_peer_select" on works
  for select using (
    is_public = true
    and exists (select 1 from works w2 where w2.user_id = auth.uid())
  );
create policy "works_teacher_select" on works
  for select using (is_teacher());

-- comments: ログイン済みは閲覧可、自分のコメントのみ作成
create policy "comments_authenticated_select" on comments
  for select using (auth.uid() is not null);
create policy "comments_owner_insert" on comments
  for insert with check (user_id = auth.uid());

-- feedbacks: 教師は自分の書込みを作成/閲覧、生徒は自分宛てを閲覧
create policy "feedbacks_teacher_write" on feedbacks
  for all using (teacher_id = auth.uid() and is_teacher())
  with check (teacher_id = auth.uid() and is_teacher());
create policy "feedbacks_student_select" on feedbacks
  for select using (student_id = auth.uid());

-- supabase/phase8_rls.sql
-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║ 【Phase 8（認証導入）で適用】それまで実行しないこと。                  ║
-- ║ migrations/ の外に置いているため `supabase db push` では流れない。     ║
-- ╚══════════════════════════════════════════════════════════════════════╝
--
-- 認証・認可を有効化する。仕様書 §4 のRLSポリシー要点を実装する。
-- 設計を前倒しで記述しておき、強制（有効化）だけ Phase 8 に回す。
--
-- 前提（Phase 8 で別途実施）:
--   * profiles を auth.users と連携させる
--     （例: profiles.id を auth.users(id) 参照に変更し、サインアップ時に
--       SECURITY DEFINER トリガで行を作成。role は既定 'student'）。
--   * 認証後回しフェーズの固定デモユーザー行は撤去するか、テストデータとして扱う。

-- 教師判定ヘルパ（RLSを越えて profiles を読むため SECURITY DEFINER）
create or replace function is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'teacher'
  );
$$;

-- 「自分は作品を提出済みか」判定ヘルパ。
-- works のポリシー内から works を参照すると同じRLSが再帰適用されてしまうため、
-- SECURITY DEFINER でRLSを迂回して評価する（self-recursive works policy 対策）。
create or replace function has_submitted_work() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from works where user_id = auth.uid() and type = 'student'
  );
$$;

-- 作品の可視性判定ヘルパ。works の SELECT ルールと同じ条件を集約する
-- （comments など他テーブルのポリシーから参照して、非公開作品のコメント漏洩を防ぐ）。
create or replace function can_view_work(w_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from works w
    where w.id = w_id
      and (
        w.type = 'sample'
        or w.user_id = auth.uid()
        or (w.is_public = true and has_submitted_work())
        or is_teacher()
      )
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
  for update using (id = auth.uid()) with check (id = auth.uid());

-- role の自己昇格を防ぐ。
-- 【注意】列単位の revoke はテーブル単位の権限があると無効になる（PostgreSQLでは表／列の
-- いずれかに権限があれば書けるため）。そこで profiles への書き込みをテーブル単位で剥奪し、
-- 安全な列だけを列単位で grant し直す。role はクライアントから設定/変更不可（既定 'student'）。
-- role の変更はサービスロール（管理）経由のみ。Phase 8 の profiles 自動作成は
-- SECURITY DEFINER トリガ／サービスロールで行うため、この剥奪の影響を受けない。
revoke insert, update on profiles from anon, authenticated;
grant insert (id, display_name) on profiles to authenticated;
grant update (display_name) on profiles to authenticated;

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
--   * 自分の作品は常に閲覧/編集可。ただし生徒作品は type='sample' へ昇格できない
--     （生徒の提出物が「サンプル」ギャラリーに紛れ込むのを防ぐ）。
--   * サンプル(type='sample')は全員閲覧可
--   * 他人の作品は is_public=true かつ 自分が提出済み の場合のみ閲覧可
--   * 教師は全件閲覧可
create policy "works_owner_all" on works
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid() and type = 'student');
create policy "works_sample_select" on works
  for select using (type = 'sample');
create policy "works_public_peer_select" on works
  for select using (is_public = true and has_submitted_work());
create policy "works_teacher_select" on works
  for select using (is_teacher());

-- comments: 「閲覧可能な作品」に紐づくコメントのみ閲覧/作成できる。
--   ログイン済みというだけで全コメントを読めると、非公開・ゲート対象の作品の
--   コメント内容や user_id が漏れてしまうため、作品の可視性で絞る。
create policy "comments_select_visible_work" on comments
  for select using (can_view_work(work_id));
create policy "comments_insert_visible_work" on comments
  for insert with check (user_id = auth.uid() and can_view_work(work_id));

-- feedbacks: 教師は自分の書込みを作成/閲覧、生徒は自分宛てを閲覧
create policy "feedbacks_teacher_write" on feedbacks
  for all using (teacher_id = auth.uid() and is_teacher())
  with check (teacher_id = auth.uid() and is_teacher());
create policy "feedbacks_student_select" on feedbacks
  for select using (student_id = auth.uid());

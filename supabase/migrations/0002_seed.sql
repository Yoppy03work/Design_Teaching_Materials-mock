-- 0002_seed.sql
-- デモユーザーとサンプル作品3件（機能優先・感情優先・対話優先）。
--   * 認証後回しフェーズでは useCurrentUser() がこのデモユーザーIDを返す
--     （lib/auth/constants.ts の DEMO_USER_ID と一致させること）。
--   * wcag_score は表示用の暫定値。Phase 2 の lib/wcag.ts で再計算される。
-- 何度流しても安全なように固定ID＋ on conflict do nothing としている。

insert into profiles (id, display_name, role)
values ('00000000-0000-0000-0000-000000000001', 'デモ生徒', 'student')
on conflict (id) do nothing;

insert into works (id, user_id, type, philosophy, persona, design_data, intent_memo, wcag_score, is_public)
values
  (
    '00000000-0000-0000-0000-0000000000a1', null, 'sample', 'function', 'grandfather',
    '{"bg":"#FFFFFF","text":"#1A1A1A","surface":"#EAF2FB","heading":"#1A1A1A","button":"#0B5FAE","buttonText":"#FFFFFF","accent":"#D87A00","tag1":"#1A73E8","tag2":"#E8710A","tag3":"#12B5CB","commentBg":"#EAF2FB","fontSize":18,"fontFamily":"sans"}',
    '機能優先：最大限のコントラストと明快な色分けで「まず読めること」を最優先した。', 3.13, true
  ),
  (
    '00000000-0000-0000-0000-0000000000a2', null, 'sample', 'emotion', 'grandfather',
    '{"bg":"#FBF7EF","text":"#3A2E1F","surface":"#F0E6D2","heading":"#3A2E1F","button":"#8C5A2B","buttonText":"#FFFFFF","accent":"#C24914","tag1":"#C24914","tag2":"#8C5A2B","tag3":"#A88300","commentBg":"#F0E6D2","fontSize":20,"fontFamily":"serif"}',
    '感情優先：セピア調の温かみで家族写真の思い出を引き立てた。文字コントラストはAAを確保。', 4.62, true
  ),
  (
    '00000000-0000-0000-0000-0000000000a3', null, 'sample', 'dialogue', 'grandfather',
    '{"bg":"#F2F5F7","text":"#16242E","surface":"#DCE6EC","heading":"#16242E","button":"#1C6E8C","buttonText":"#FFFFFF","accent":"#E0A100","tag1":"#1C6E8C","tag2":"#2E7D32","tag3":"#6A4C93","commentBg":"#DCE6EC","fontSize":18,"fontFamily":"rounded"}',
    '対話優先：祖父に何度か見せ、青系の落ち着きと暖色アクセントの組み合わせに調整した。', 2.07, true
  )
on conflict (id) do nothing;

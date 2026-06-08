// 認証後回しフェーズで使う固定デモユーザー。
// supabase/migrations/0002_seed.sql で同じUUIDの profiles 行を seed している。
// Phase 8 で本物の認証を導入したら、この定数への依存を useCurrentUser() ごと外す。
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
export const DEMO_USER_NAME = "デモ生徒";

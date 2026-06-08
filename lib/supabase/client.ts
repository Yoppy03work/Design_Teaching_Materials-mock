import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

/**
 * ブラウザ用 Supabase クライアント（匿名キー）。クライアントコンポーネントから使う。
 * 認証後回しフェーズでは RLS 無効・固定デモユーザーで読み書きする。
 * Phase 8 で RLS を有効化すると、同じ呼び出しのまま本人スコープに制限される。
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase の環境変数が未設定です。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。",
    );
  }
  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}

/**
 * Supabase の接続情報が設定済みかどうか。
 * 認証後回しフェーズでは未設定でもアプリを起動できるよう、データ層の呼び出し前に
 * これで判定し、未設定ならセッション内メモリのみで進行する。
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

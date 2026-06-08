"use client";

import { DEMO_USER_ID, DEMO_USER_NAME } from "@/lib/auth/constants";
import type { Role } from "@/lib/types";

export type CurrentUser = {
  id: string;
  displayName: string;
  role: Role;
};

/**
 * 身元の「唯一の出入口」。コンポーネントは Supabase Auth を直接触らず、必ずここを経由する。
 *
 * 【認証後回し】現在は固定のデモユーザーを返す。
 * 【Phase 8】この関数の中身を Supabase Auth のセッション読み取りに差し替えるだけで、
 *            アプリ全体が認証対応になる（呼び出し側は無改修）。
 */
export function useCurrentUser(): CurrentUser {
  return { id: DEMO_USER_ID, displayName: DEMO_USER_NAME, role: "student" };
}

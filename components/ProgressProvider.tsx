"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  completeStep as repoCompleteStep,
  getProgress,
} from "@/lib/repo/progress";
import type { StepId } from "@/lib/types";

type ProgressContextValue = {
  /** 完了済みステップ */
  completed: Set<StepId>;
  isCompleted: (id: StepId) => boolean;
  /** ステップを完了にする（永続化可能なら Supabase にも保存） */
  markCompleted: (id: StepId) => Promise<void>;
  /** 初回ロード中か */
  loading: boolean;
  /** Supabase 永続化が有効か（false ならセッション内メモリのみ） */
  persisted: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const persisted = isSupabaseConfigured();
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [loading, setLoading] = useState(persisted);

  useEffect(() => {
    if (!persisted) return;
    let active = true;
    (async () => {
      try {
        const rows = await getProgress(user.id);
        if (active) {
          setCompleted(new Set(rows.map((r) => r.step_id as StepId)));
        }
      } catch {
        // 取得失敗時はセッション内メモリのみで進行する
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user.id, persisted]);

  const markCompleted = useCallback(
    async (id: StepId) => {
      setCompleted((prev) => new Set(prev).add(id));
      if (!persisted) return;
      try {
        await repoCompleteStep(user.id, id);
      } catch {
        // 保存に失敗してもメモリ上の進捗は維持する
      }
    },
    [user.id, persisted],
  );

  const isCompleted = useCallback(
    (id: StepId) => completed.has(id),
    [completed],
  );

  return (
    <ProgressContext.Provider
      value={{ completed, isCompleted, markCompleted, loading, persisted }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress は ProgressProvider の内側で使ってください");
  }
  return ctx;
}

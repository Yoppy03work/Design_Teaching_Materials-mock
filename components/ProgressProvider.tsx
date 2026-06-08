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
import { STEP_IDS } from "@/lib/steps";

type ProgressContextValue = {
  /** 完了済みステップ */
  completed: Set<StepId>;
  isCompleted: (id: StepId) => boolean;
  /** ステップを完了にする（永続化可能なら Supabase にも保存） */
  markCompleted: (id: StepId) => Promise<void>;
  /** 初回ロード中か */
  loading: boolean;
  /** 実際に Supabase へ永続化できているか（未接続や読み書き失敗時は false） */
  persisted: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const configured = isSupabaseConfigured();
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [loading, setLoading] = useState(configured);
  // 永続化が実際に効いているか。未接続、または読み/書き失敗で in-memory に退避したら false。
  const [persisted, setPersisted] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    (async () => {
      try {
        const rows = await getProgress(user.id);
        if (!active) return;
        // 「置換」ではなく「マージ」する：ロード中に行われた楽観更新を消さないため。
        // 既知のステップIDのみ採用する（progress.step_id は text 型なので、旧データや
        // タイプミスが混ざっても完了数・進捗を汚さないようにする）。
        const known = new Set<string>(STEP_IDS);
        setCompleted((prev) => {
          const merged = new Set(prev);
          for (const r of rows) {
            if (known.has(r.step_id)) merged.add(r.step_id as StepId);
          }
          return merged;
        });
      } catch {
        // 接続情報はあるが読み取りに失敗 → in-memory に退避し、警告を出せるようにする。
        if (active) setPersisted(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user.id, configured]);

  const markCompleted = useCallback(
    async (id: StepId) => {
      setCompleted((prev) => new Set(prev).add(id));
      if (!configured) return;
      try {
        await repoCompleteStep(user.id, id);
      } catch {
        // 保存失敗 → in-memory に退避（メモリ上の進捗は維持し、警告を表示）。
        setPersisted(false);
      }
    },
    [user.id, configured],
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

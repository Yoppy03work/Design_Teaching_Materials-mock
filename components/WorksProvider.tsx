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
import { listWorks, submitWork as repoSubmitWork } from "@/lib/repo/works";
import { addComment as repoAddComment, listComments } from "@/lib/repo/comments";
import { SAMPLE_WORKS } from "@/lib/sampleWorks";
import type { Comment, DesignData, Work } from "@/lib/types";

export type SubmitInput = {
  designData: DesignData;
  intentMemo: string;
  wcagScore: number;
  isPublic?: boolean;
};

type WorksContextValue = {
  works: Work[];
  commentsByWork: Record<string, Comment[]>;
  loading: boolean;
  /** Supabase に永続化できているか（false ならセッション内のみ） */
  persisted: boolean;
  submit: (input: SubmitInput) => Promise<void>;
  addComment: (workId: string, content: string) => Promise<void>;
};

const WorksContext = createContext<WorksContextValue | null>(null);

export function WorksProvider({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const configured = isSupabaseConfigured();
  const [works, setWorks] = useState<Work[]>([]);
  const [commentsByWork, setCommentsByWork] = useState<
    Record<string, Comment[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [persisted, setPersisted] = useState(configured);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!configured) {
        if (active) {
          setWorks(SAMPLE_WORKS);
          setLoading(false);
        }
        return;
      }
      try {
        const rows = await listWorks("all");
        const entries = await Promise.all(
          rows.map(
            async (w) => [w.id, await listComments(w.id)] as const,
          ),
        );
        if (!active) return;
        setWorks(rows);
        setCommentsByWork(Object.fromEntries(entries));
      } catch {
        // 読み取り失敗 → サンプルにフォールバックし、非永続を明示
        if (active) {
          setWorks(SAMPLE_WORKS);
          setPersisted(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [configured]);

  const submit = useCallback(
    async (input: SubmitInput) => {
      if (configured) {
        try {
          const created = await repoSubmitWork(user.id, input);
          setWorks((prev) => [created, ...prev]);
          return;
        } catch {
          setPersisted(false); // 失敗時はセッション内保存に退避
        }
      }
      const local: Work = {
        id: crypto.randomUUID(),
        user_id: user.id,
        type: "student",
        philosophy: null,
        persona: "grandfather",
        design_data: input.designData,
        intent_memo: input.intentMemo,
        wcag_score: input.wcagScore,
        is_public: input.isPublic ?? false,
        created_at: new Date().toISOString(),
      };
      setWorks((prev) => [local, ...prev]);
    },
    [configured, user.id],
  );

  const addComment = useCallback(
    async (workId: string, content: string) => {
      if (configured && persisted) {
        try {
          const created = await repoAddComment(user.id, workId, content);
          setCommentsByWork((prev) => ({
            ...prev,
            [workId]: [...(prev[workId] ?? []), created],
          }));
          return;
        } catch {
          setPersisted(false);
        }
      }
      const local: Comment = {
        id: crypto.randomUUID(),
        user_id: user.id,
        work_id: workId,
        content,
        created_at: new Date().toISOString(),
      };
      setCommentsByWork((prev) => ({
        ...prev,
        [workId]: [...(prev[workId] ?? []), local],
      }));
    },
    [configured, persisted, user.id],
  );

  return (
    <WorksContext.Provider
      value={{ works, commentsByWork, loading, persisted, submit, addComment }}
    >
      {children}
    </WorksContext.Provider>
  );
}

export function useWorks(): WorksContextValue {
  const ctx = useContext(WorksContext);
  if (!ctx) {
    throw new Error("useWorks は WorksProvider の内側で使ってください");
  }
  return ctx;
}

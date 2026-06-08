"use client";

import { useRef, useState } from "react";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "祖父に見やすい配色のヒントがほしい",
  "赤と緑のボタンは祖父にどう見える？",
  "コントラスト比はどれくらい必要？",
];

export function AIAssistant() {
  const user = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, messages: next }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "エラーが発生しました。");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.text ?? "" }]);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      });
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">AI壁打ち</p>
        <span className="text-xs text-muted-foreground">答えではなく問いを返します</span>
      </div>

      <div
        ref={listRef}
        className="flex max-h-80 min-h-32 flex-col gap-3 overflow-y-auto"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>配色の設計で迷ったら相談してみましょう。例：</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
              m.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground",
            )}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            考え中…
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力（実在の家族の個人情報は書かないでね）"
          aria-label="AIへの質問"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          送信
        </Button>
      </form>
    </div>
  );
}

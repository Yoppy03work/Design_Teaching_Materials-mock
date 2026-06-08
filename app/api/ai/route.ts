import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logAi } from "@/lib/repo/aiLogs";

// 仕様書 §6 のシステムプロンプト（壁打ち相手の役割）。
const SYSTEM_PROMPT = `あなたは高校情報I「アクセシブルなデザイン」教材の壁打ち相手です。
高校1年生が、共通ペルソナ「祖父」（68歳・色覚多様性=赤緑色弱・老眼）の
ための家族写真アルバムサイトの配色を設計しています。

【あなたの役割】
- 答えを直接示さない。生徒自身に考えさせる。
- 「祖父の視点ではこの配色はどう見えるだろう？」と問いかける形で支援する。
- 複数のデザインの方向性（機能優先・感情優先・対話を通じた最適化）があることを示す。
- WCAGコントラスト比などの技術知識は、聞かれたら簡潔に補足する。

【応答ルール】
- 200字以内で簡潔に。
- 高校1年生に分かる言葉を使う。
- 断定的・上から目線にならない。優しく問い返す。
- 生徒が設計意図を言語化できるよう促す。
- 「正解」を与えず、「あなたはどう思う？」で締めることを基本とする。

【禁止事項】
- 配色のHEX値を直接指定して「これにしなさい」と言わない。
- 個人を特定する情報には触れない。`;

const MAX_TURNS = 12; // 直近の往復のみ送る（コスト/コンテキスト管理）
const MAX_CHARS = 2000; // 1メッセージの最大長

type ChatMessage = { role: "user" | "assistant"; content: string };

function isSupabaseServerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AIは現在利用できません（サーバーにAPIキーが未設定です）。" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json(
      { error: "メッセージがありません。" },
      { status: 400 },
    );
  }

  // サニタイズ：role/content のみ採用し、長さ・件数を制限。
  const messages: ChatMessage[] = raw
    .slice(-MAX_TURNS)
    .map((m) => {
      const role = (m as ChatMessage)?.role === "assistant" ? "assistant" : "user";
      const content = String((m as ChatMessage)?.content ?? "").slice(0, MAX_CHARS);
      return { role, content } as ChatMessage;
    })
    .filter((m) => m.content.length > 0);

  // 先頭が assistant だと Anthropic API が 400 になる（最初は user 必須）。
  // 直近 N 件に切り詰めた結果 assistant 始まりになり得るので user 始まりに整える。
  while (messages.length > 0 && messages[0].role === "assistant") {
    messages.shift();
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "ユーザーのメッセージで終わる必要があります。" },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  let text: string;
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5", // 仕様書指定。コスト配慮の教材用途。
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    });
    text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "混み合っています。少し待ってから試してください。" },
        { status: 429 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "AIの応答でエラーが発生しました。" },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: "予期しないエラーが発生しました。" },
      { status: 500 },
    );
  }

  // ai_logs への保存（ベストエフォート。サーバー用クライアントで RLS 越え）。
  const userId = (body as { userId?: unknown })?.userId;
  if (typeof userId === "string" && isSupabaseServerConfigured()) {
    try {
      const prompt = messages[messages.length - 1].content;
      await logAi(createServiceClient(), userId, prompt, text);
    } catch {
      // 保存失敗は応答に影響させない
    }
  }

  return NextResponse.json({ text });
}

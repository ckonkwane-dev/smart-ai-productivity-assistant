import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { Database } from "@/integrations/supabase/types";
import { createGateway, reasoningOptions, friendlyAiError } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return new Response("Please sign in to chat.", { status: 401 });

        const url = process.env["SUPABASE_URL"]!;
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const supabase = createClient<Database>(url, key, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Please sign in to chat.", { status: 401 });
        const userId = userData.user.id;

        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) return new Response("Messages are required", { status: 400 });
        const messages = body.messages as UIMessage[];
        const last = messages[messages.length - 1];
        if (last?.role === "user") {
          const { error } = await supabase
            .from("chat_messages")
            .insert({ user_id: userId, message: last as never });
          if (error) console.error("Failed to save user message", error);
        }

        let gateway;
        try {
          gateway = createGateway();
        } catch (e) {
          return new Response(friendlyAiError(e), { status: 500 });
        }

        const result = streamText({
          model: gateway.model,
          system:
            "You are a helpful, concise workplace productivity assistant. Help with emails, planning, meetings, research and professional questions. Use markdown when helpful. Be honest about uncertainty.",
          messages: await convertToModelMessages(messages),
          providerOptions: reasoningOptions,
          abortSignal: request.signal,
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onError: (err) => friendlyAiError(err),
          onFinish: async ({ responseMessage }) => {
            const text = responseMessage.parts.some((p) => p.type === "text" && p.text.trim());
            if (!text) return;
            const clean = { ...responseMessage, parts: responseMessage.parts.filter((p) => p.type === "text") };
            const { error } = await supabase
              .from("chat_messages")
              .insert({ user_id: userId, message: clean as never });
            if (error) console.error("Failed to save assistant message", error);
          },
        });
      },
    },
  },
});

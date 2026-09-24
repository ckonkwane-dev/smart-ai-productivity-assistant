import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { toolByKey } from "@/lib/tools";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace Assistant" },
      { name: "description", content: "Chat with your AI workplace assistant; your conversation is saved." },
      { property: "og:title", content: "AI Chatbot — AI Workplace Assistant" },
      { property: "og:description", content: "Chat with your AI workplace assistant; your conversation is saved." },
    ],
  }),
  component: ChatPage,
});

const tool = toolByKey("chat");

function ChatPage() {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("message")
      .order("created_at")
      .then(({ data, error }) => {
        if (error) toast.error("Couldn't load your saved conversation.");
        setHistory((data ?? []).map((r) => r.message as unknown as UIMessage));
      });
  }, [user]);

  return (
    <>
      <PageHeader
        eyebrow="AI Tool"
        title={tool.title}
        description={tool.description}
        info={tool.aiExplainer}
        actions={
          user && history ? (
            <ClearButton
              onCleared={() => {
                setHistory(null);
                setTimeout(() => setHistory([]), 0);
              }}
            />
          ) : null
        }
      />
      {loading ? null : !user ? (
        <div className="panel p-8 text-center">
          <p className="font-display text-lg font-bold">Sign in to start chatting</p>
          <p className="mt-1 text-sm text-muted-foreground">Your conversation is saved privately to your account.</p>
          <Button className="mt-4" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      ) : history ? (
        <ChatWindow initial={history} />
      ) : (
        <div className="panel p-8">
          <Shimmer>Loading your conversation…</Shimmer>
        </div>
      )}
    </>
  );
}

function ClearButton({ onCleared }: { onCleared: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        if (!confirm("Clear the whole conversation?")) return;
        const { data } = await supabase.auth.getUser();
        const { error } = await supabase.from("chat_messages").delete().eq("user_id", data.user!.id);
        if (error) toast.error("Couldn't clear the conversation.");
        else onCleared();
      }}
    >
      <Trash2 /> Clear chat
    </Button>
  );
}

function ChatWindow({ initial }: { initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
        },
      }),
    [],
  );
  const { messages, sendMessage, status, stop } = useChat({
    id: "main",
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message || "The AI request failed."),
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="panel animate-rise flex h-[calc(100vh-18rem)] min-h-[420px] flex-col overflow-hidden">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="How can I help today?"
              description="Ask me to draft a message, plan your week, or explain a concept."
            />
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent>
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "assistant" ? (
                        <MessageResponse key={i}>{p.text}</MessageResponse>
                      ) : (
                        <span key={i} className="whitespace-pre-wrap">
                          {p.text}
                        </span>
                      )
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="border-t border-border p-3">
        <PromptInput
          onSubmit={(msg) => {
            if (!msg.text.trim() || busy) return;
            sendMessage({ text: msg.text });
            setInput("");
          }}
        >
          <PromptInputTextarea
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your workplace assistant…"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

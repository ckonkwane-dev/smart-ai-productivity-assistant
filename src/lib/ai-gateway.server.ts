import { createOpenAI } from "@ai-sdk/openai";

export const AI_MODEL = "openai/gpt-6-astra";

export function createGatewayRunIdFetch() {
  let runId: string | undefined;
  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
    const res = await fetch(input, { ...init, headers });
    runId = res.headers.get("X-Lovable-AIG-Run-ID") ?? runId;
    return res;
  };
  return { fetch: wrapped, getRunId: () => runId };
}

export function createGateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing key).");
  const runIdFetch = createGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return { model: provider.responses(AI_MODEL), runIdFetch };
}

export const reasoningOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export function friendlyAiError(err: unknown): string {
  const e = err as { statusCode?: number; message?: string };
  const status = e?.statusCode;
  if (status === 429) return "The AI is busy right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits have run out for this workspace. Add credits to keep using AI features.";
  if (status === 403) return "AI access is currently blocked for this workspace.";
  return e?.message || "The AI request failed. Please try again.";
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research"]),
  fields: z.record(z.string().max(20000)),
});

const SYSTEM: Record<z.infer<typeof Input>["tool"], string> = {
  email:
    "You are an expert business writer. Write a professional email. Output plain text only: first line 'Subject: ...', blank line, then the email body with greeting and sign-off. No markdown.",
  meeting:
    "You summarize meeting notes. Output plain text with these sections: SUMMARY (3-5 sentences), KEY DECISIONS (bullets with '- '), ACTION ITEMS (bullets '- [Owner] Task — Due date' when known), OPEN QUESTIONS. No markdown symbols other than '- '.",
  tasks:
    "You are a productivity coach. Build a prioritized, time-boxed plan. Output plain text: PRIORITIES (numbered, with Priority High/Medium/Low and estimated time), SCHEDULE (time blocks), TIPS (2-3 bullets). No markdown headings or bold.",
  research:
    "You are a research assistant. Using general knowledge (no live browsing), write a structured brief in plain text: OVERVIEW, KEY FINDINGS (bullets), CONSIDERATIONS & RISKS, SUGGESTED NEXT STEPS, SOURCES TO VERIFY (types of reputable sources). Flag uncertainty. No markdown headings or bold.",
};

export const generateOutput = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { createGateway, reasoningOptions, friendlyAiError } = await import("./ai-gateway.server");
    const prompt = Object.entries(data.fields)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}:\n${v}`)
      .join("\n\n");
    if (!prompt) return { ok: false as const, error: "Please fill in the input first." };
    try {
      const { model } = createGateway();
      let failure: unknown = null;
      const result = streamText({
        model,
        system: SYSTEM[data.tool],
        prompt,
        providerOptions: reasoningOptions,
        maxRetries: 1,
        onError: ({ error }) => {
          failure = error;
        },
      });
      const text = await result.text;
      if (failure) return { ok: false as const, error: friendlyAiError(failure) };
      if (!text.trim()) return { ok: false as const, error: "The AI returned an empty response. Try adding more detail." };
      return { ok: true as const, text: text.trim() };
    } catch (err) {
      console.error(err);
      return { ok: false as const, error: friendlyAiError(err) };
    }
  });

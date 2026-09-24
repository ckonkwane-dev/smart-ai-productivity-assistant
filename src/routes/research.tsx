import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, ToolWorkspace } from "@/components/tool-workspace";
import { toolByKey } from "@/lib/tools";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      { name: "description", content: "Get a structured research brief on any workplace topic." },
      { property: "og:title", content: "AI Research Assistant — AI Workplace Assistant" },
      { property: "og:description", content: "Get a structured research brief on any workplace topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState("Standard brief");
  return (
    <ToolWorkspace
      tool={toolByKey("research")}
      fields={{ "Research question": question, Context: context, Depth: depth }}
      canSubmit={question.trim().length > 0}
      submitLabel="Research topic"
      outputPlaceholder="Your research brief will appear here."
    >
      <Field label="Research question *" htmlFor="q">
        <Input id="q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What are best practices for hybrid work policies?" />
      </Field>
      <Field label="Depth" htmlFor="depth">
        <Select value={depth} onValueChange={setDepth}>
          <SelectTrigger id="depth">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Quick overview", "Standard brief", "In-depth analysis"].map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Context" htmlFor="ctx">
        <Textarea id="ctx" rows={6} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Industry, audience, what you'll use it for…" />
      </Field>
    </ToolWorkspace>
  );
}

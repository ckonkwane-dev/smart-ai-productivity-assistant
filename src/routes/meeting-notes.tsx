import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, ToolWorkspace } from "@/components/tool-workspace";
import { toolByKey } from "@/lib/tools";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Summarize meeting notes into decisions and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { property: "og:description", content: "Summarize meeting notes into decisions and action items." },
    ],
  }),
  component: MeetingPage,
});

function MeetingPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <ToolWorkspace
      tool={toolByKey("meeting")}
      fields={{ "Meeting title": title, "Notes or transcript": notes }}
      canSubmit={notes.trim().length > 20}
      submitLabel="Summarize meeting"
      outputPlaceholder="Summary, decisions and action items will appear here."
    >
      <Field label="Meeting title" htmlFor="mtitle">
        <Input id="mtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekly product sync" />
      </Field>
      <Field label="Notes or transcript *" htmlFor="notes">
        <Textarea id="notes" rows={12} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your raw notes or transcript (at least a few sentences)…" />
      </Field>
    </ToolWorkspace>
  );
}

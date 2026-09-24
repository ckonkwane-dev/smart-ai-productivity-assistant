import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, ToolWorkspace } from "@/components/tool-workspace";
import { toolByKey } from "@/lib/tools";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      { name: "description", content: "Generate polished professional emails in the tone you choose." },
      { property: "og:title", content: "Smart Email Generator — AI Workplace Assistant" },
      { property: "og:description", content: "Generate polished professional emails in the tone you choose." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Apologetic", "Direct"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState("Formal");

  return (
    <ToolWorkspace
      tool={toolByKey("email")}
      fields={{ Recipient: recipient, Purpose: purpose, "Key points": points, Tone: tone }}
      canSubmit={purpose.trim().length > 0}
      submitLabel="Generate email"
      outputPlaceholder="Your generated email will appear here — you can edit it directly."
    >
      <Field label="Recipient" htmlFor="recipient">
        <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Maria, Head of Procurement" />
      </Field>
      <Field label="Tone" htmlFor="tone">
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Purpose *" htmlFor="purpose">
        <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on the Q3 pricing proposal" />
      </Field>
      <Field label="Key points" htmlFor="points">
        <Textarea id="points" rows={5} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Confirm revised tiers, ask for a decision by Friday…" />
      </Field>
    </ToolWorkspace>
  );
}

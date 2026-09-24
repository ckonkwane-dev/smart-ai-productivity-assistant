import { useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateOutput } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import type { ToolInfo } from "@/lib/tools";

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="eyebrow">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function ToolWorkspace({
  tool,
  tool: { key },
  fields,
  canSubmit,
  submitLabel,
  children,
  outputPlaceholder,
}: {
  tool: ToolInfo;
  fields: Record<string, string>;
  canSubmit: boolean;
  submitLabel: string;
  children: ReactNode;
  outputPlaceholder: string;
}) {
  const generate = useServerFn(generateOutput);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(e?: FormEvent) {
    e?.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { tool: key as "email", fields } });
      if (res.ok) setOutput(res.text);
      else setError(res.error);
    } catch {
      setError("Couldn't reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const words = output.trim() ? output.trim().split(/\s+/).length : 0;

  return (
    <>
      <PageHeader eyebrow="AI Tool" title={tool.title} description={tool.description} info={tool.aiExplainer} />
      <div className="grid gap-5 lg:grid-cols-12">
        <form onSubmit={run} className="panel animate-rise lg:col-span-5 [animation-delay:80ms]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-sm font-bold">Input</p>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-medium text-accent-foreground">
              Your details
            </span>
          </div>
          <div className="space-y-4 p-4">
            {children}
            <Button type="submit" className="w-full" disabled={!canSubmit || loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? "Generating…" : submitLabel}
            </Button>
          </div>
        </form>

        <section className="panel animate-rise flex flex-col lg:col-span-7 [animation-delay:160ms]">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="font-display text-sm font-bold">Output</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                <span
                  className={`size-1.5 rounded-full ${loading ? "animate-pulse bg-warn" : output ? "bg-positive" : "bg-border"}`}
                />
                {loading ? "Working" : output ? "Ready · editable" : "Waiting"}
              </span>
              <Button type="button" variant="outline" size="xs" disabled={!output || loading} onClick={() => run()}>
                <RotateCcw /> Regenerate
              </Button>
              <Button
                type="button"
                variant="ink"
                size="xs"
                disabled={!output}
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy /> Copy
              </Button>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-4">
            {error && (
              <p role="alert" className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Textarea
              aria-label="AI output (editable)"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={loading ? "The AI is writing…" : outputPlaceholder}
              className="min-h-[360px] flex-1 resize-y bg-background text-sm leading-relaxed"
            />
            <p className="mt-3 font-mono text-[10px] text-muted-foreground">
              {words} words · edit freely before using
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

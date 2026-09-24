import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, InfoTip } from "@/components/page-header";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content: "Automate emails, meeting summaries, task plans, research and chat with one AI workplace assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate emails, meeting summaries, task plans, research and chat with one AI workplace assistant.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  { n: "01", t: "Pick a tool", d: "Choose the task you want help with from the sidebar." },
  { n: "02", t: "Describe it", d: "Fill in the input section with your notes or request." },
  { n: "03", t: "Review & edit", d: "Refine the AI output in the editable area, then copy it." },
];

function Index() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to your AI workplace assistant"
        description="Five AI tools that take the busywork out of your day — draft emails, summarize meetings, plan tasks, research topics and chat for quick help."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.n} className="panel animate-rise p-4" style={{ animationDelay: `${i * 70}ms` }}>
            <p className="eyebrow">Step {s.n}</p>
            <p className="mt-2 font-display text-lg font-bold">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold">AI tools</h2>
          <p className="font-mono text-[11px] text-muted-foreground">5 available</p>
        </div>
        <div className="panel divide-y divide-border overflow-hidden">
          {TOOLS.map((t) => (
            <div key={t.key} className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-background">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-accent-foreground">
                <t.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-bold">{t.title}</p>
                  <InfoTip text={t.aiExplainer} label={t.title} />
                </div>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
              <Link
                to={t.to}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Open <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

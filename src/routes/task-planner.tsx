import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, ToolWorkspace } from "@/components/tool-workspace";
import { toolByKey } from "@/lib/tools";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      { name: "description", content: "Turn your to-do list into a prioritized, time-boxed plan." },
      { property: "og:title", content: "AI Task Planner — AI Workplace Assistant" },
      { property: "og:description", content: "Turn your to-do list into a prioritized, time-boxed plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [time, setTime] = useState("");
  const [goal, setGoal] = useState("");
  return (
    <ToolWorkspace
      tool={toolByKey("tasks")}
      fields={{ Tasks: tasks, "Time available": time, "Main goal": goal }}
      canSubmit={tasks.trim().length > 0}
      submitLabel="Build my plan"
      outputPlaceholder="Your prioritized plan and schedule will appear here."
    >
      <Field label="Tasks *" htmlFor="tasks">
        <Textarea id="tasks" rows={8} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"One per line, e.g.\nPrepare board slides (due Thu)\nReply to client emails\nReview hiring shortlist"} />
      </Field>
      <Field label="Time available" htmlFor="time">
        <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. Today 9:00–17:00, meetings 11–12" />
      </Field>
      <Field label="Main goal" htmlFor="goal">
        <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Finish the board deck" />
      </Field>
    </ToolWorkspace>
  );
}

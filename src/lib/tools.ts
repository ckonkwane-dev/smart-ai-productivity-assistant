import { Mail, NotebookPen, ListChecks, Search, MessageSquare, type LucideIcon } from "lucide-react";

export type ToolKey = "email" | "meeting" | "tasks" | "research" | "chat";

export interface ToolInfo {
  key: ToolKey;
  to: "/email" | "/meeting-notes" | "/task-planner" | "/research" | "/chat";
  title: string;
  description: string;
  aiExplainer: string;
  icon: LucideIcon;
}

export const TOOLS: ToolInfo[] = [
  {
    key: "email",
    to: "/email",
    title: "Smart Email Generator",
    description: "Turn a few notes into a polished, ready-to-send email in the tone you choose.",
    aiExplainer:
      "The AI reads your purpose, recipient and key points, then writes a subject line and email body in the selected tone.",
    icon: Mail,
  },
  {
    key: "meeting",
    to: "/meeting-notes",
    title: "Meeting Notes Summarizer",
    description: "Paste raw notes or a transcript and get a clean summary, decisions and action items.",
    aiExplainer:
      "The AI condenses your notes into a short summary, lists key decisions, and pulls out action items with owners and deadlines when mentioned.",
    icon: NotebookPen,
  },
  {
    key: "tasks",
    to: "/task-planner",
    title: "AI Task Planner",
    description: "Describe your goals and time available — get a prioritized, time-boxed plan.",
    aiExplainer:
      "The AI prioritizes your tasks by urgency and impact, estimates effort, and arranges them into a realistic schedule for the time you have.",
    icon: ListChecks,
  },
  {
    key: "research",
    to: "/research",
    title: "AI Research Assistant",
    description: "Ask a question and receive a structured brief with key findings and next steps.",
    aiExplainer:
      "The AI draws on its general knowledge to produce an overview, key points, considerations and suggested sources to verify. It does not browse the live web.",
    icon: Search,
  },
  {
    key: "chat",
    to: "/chat",
    title: "AI Chatbot",
    description: "One ongoing conversation with your workplace assistant, saved to your account.",
    aiExplainer:
      "The AI answers questions and helps with workplace tasks, remembering earlier messages in this conversation.",
    icon: MessageSquare,
  },
];

export const toolByKey = (key: ToolKey) => TOOLS.find((t) => t.key === key)!;

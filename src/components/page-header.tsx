import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function InfoTip({ text, label }: { text: string; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`What the AI does in ${label}`}
          className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Info className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{text}</TooltipContent>
    </Tooltip>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  info,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  info?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="animate-rise flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          {info && <InfoTip text={info} label={title} />}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}

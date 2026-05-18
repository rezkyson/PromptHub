import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-block-coral px-6 py-10 text-foreground sm:px-10",
        className
      )}
      role="alert"
    >
      <div className="max-w-xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em]">Error</p>
        <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
        {description ? <p className="leading-7">{description}</p> : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}

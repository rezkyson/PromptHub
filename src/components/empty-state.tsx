import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-block-cream px-6 py-12 text-center text-foreground sm:px-10",
        className
      )}
    >
      <div className="mx-auto max-w-lg space-y-4">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7">{description}</p>
        ) : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}

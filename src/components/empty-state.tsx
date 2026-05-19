import type { ReactNode } from "react";
import { InboxIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: LucideIcon;
};

export function EmptyState({
  title,
  description,
  action,
  className,
  icon: Icon = InboxIcon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-block-cream px-6 py-12 text-center text-foreground sm:px-10",
        className
      )}
    >
      <div className="mx-auto max-w-lg space-y-4">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-background/70">
          <Icon aria-hidden="true" className="size-5" />
        </div>
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

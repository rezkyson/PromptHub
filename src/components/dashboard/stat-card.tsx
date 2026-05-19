import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  description: string;
  icon?: LucideIcon;
};

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 text-card-foreground">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.16em]">{label}</p>
        {Icon ? (
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-4xl font-medium tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}

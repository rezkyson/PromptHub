import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = "Memuat data", className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)} aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-[0.16em]">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="space-y-4 rounded-2xl border bg-card p-5"
            key={index}
          >
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

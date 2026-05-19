import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonListProps = {
  count?: number;
};

export function HeaderSkeleton() {
  return (
    <header className="border-b bg-background/95">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </nav>
    </header>
  );
}

export function HeroSkeleton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-3xl bg-block-lilac p-8 sm:p-12", className)}>
      <Skeleton className="h-4 w-32 bg-background/50" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-12 w-full max-w-2xl bg-background/55 sm:h-16" />
        {!compact ? (
          <>
            <Skeleton className="h-12 w-3/4 max-w-xl bg-background/55 sm:h-16" />
            <Skeleton className="mt-6 h-5 w-full max-w-xl bg-background/45" />
            <Skeleton className="h-5 w-2/3 max-w-lg bg-background/45" />
          </>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="rounded-3xl bg-block-mint p-8 sm:p-12">
        <Skeleton className="h-4 w-28 bg-background/50" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-3xl bg-background/55 sm:h-16" />
          <Skeleton className="h-12 w-4/5 max-w-2xl bg-background/55 sm:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-2xl bg-background/45" />
          <Skeleton className="h-5 w-3/5 max-w-xl bg-background/45" />
        </div>
      </div>
      <StatGridSkeleton />
      <SectionHeaderSkeleton />
      <MyPromptListSkeleton count={3} />
    </>
  );
}

export function HomeSkeleton() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-8 rounded-3xl bg-block-lime p-8 text-foreground sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Skeleton className="h-4 w-28 bg-background/50" />
            <div className="mt-8 space-y-4">
              <Skeleton className="h-12 w-full max-w-3xl bg-background/55 sm:h-16" />
              <Skeleton className="h-12 w-5/6 max-w-2xl bg-background/55 sm:h-16" />
              <Skeleton className="mt-6 h-5 w-full max-w-2xl bg-background/45" />
              <Skeleton className="h-5 w-2/3 max-w-xl bg-background/45" />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 w-40 rounded-full bg-background/55" />
              <Skeleton className="h-10 w-40 rounded-full bg-background/55" />
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/15 bg-background/80 p-5 shadow-sm dark:bg-card/85">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-10 w-14" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
        <PromptGridSkeleton count={6} />
      </section>
    </>
  );
}

export function SettingsSkeleton() {
  return (
    <>
      <div className="rounded-3xl bg-block-cream p-8 sm:p-12">
        <Skeleton className="h-4 w-24 bg-background/50" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-xl bg-background/55 sm:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-2xl bg-background/45" />
          <Skeleton className="h-5 w-3/4 max-w-xl bg-background/45" />
        </div>
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6 text-card-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-5 w-44" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <>
      <div className="rounded-3xl bg-block-mint p-8 sm:p-12">
        <Skeleton className="h-4 w-32 bg-background/50" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-3xl bg-background/55 sm:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-2xl bg-background/45" />
          <Skeleton className="h-5 w-2/3 max-w-xl bg-background/45" />
          <Skeleton className="mt-6 h-4 w-36 bg-background/45" />
        </div>
      </div>
      <PromptGridSkeleton count={6} />
    </>
  );
}

export function PromptFormSkeleton() {
  return (
    <>
      <div className="mb-8 rounded-3xl bg-block-cream p-8 sm:p-12">
        <Skeleton className="h-4 w-32 bg-background/50" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-2xl bg-background/55 sm:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-2xl bg-background/45" />
          <Skeleton className="h-5 w-3/4 max-w-xl bg-background/45" />
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-36 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
    </>
  );
}

export function FilterSkeleton() {
  return (
    <div className="mt-8 grid gap-3 rounded-3xl bg-block-cream p-4 sm:grid-cols-[1fr_240px]">
      <Skeleton className="h-12 rounded-2xl bg-background/75" />
      <Skeleton className="h-12 rounded-2xl bg-background/75" />
    </div>
  );
}

export function PromptCardSkeleton() {
  return (
    <article className="flex min-h-[260px] flex-col rounded-2xl border bg-card p-5 text-card-foreground">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-5 flex-1 space-y-3">
        <Skeleton className="h-7 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function PromptGridSkeleton({ count = 6 }: SkeletonListProps) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PromptCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MyPromptRowSkeleton() {
  return (
    <article className="grid gap-5 rounded-2xl border bg-card p-5 text-card-foreground lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 lg:justify-end">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </article>
  );
}

export function MyPromptListSkeleton({ count = 3 }: SkeletonListProps) {
  return (
    <div className="mt-5 space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <MyPromptRowSkeleton key={index} />
      ))}
    </div>
  );
}

export function StatGridSkeleton() {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="rounded-2xl border bg-card p-5" key={index}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-6 h-10 w-16" />
          <Skeleton className="mt-4 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}

export function PromptDetailSkeleton() {
  return (
    <>
      <HeroSkeleton className="bg-block-lime" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <article className="rounded-3xl border bg-card p-5 text-card-foreground sm:p-6">
          <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="space-y-3 rounded-2xl bg-muted p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </article>
        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-5 h-4 w-36" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>
          <div className="rounded-3xl border bg-card p-5">
            <Skeleton className="h-4 w-28" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

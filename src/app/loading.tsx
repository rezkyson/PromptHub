import { HeaderSkeleton, HomeSkeleton } from "@/components/skeleton-layouts";

export default function RootLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground" data-motion-loading>
      <HeaderSkeleton />
      <HomeSkeleton />
    </main>
  );
}

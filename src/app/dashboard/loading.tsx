import { DashboardSkeleton } from "@/components/skeleton-layouts";

export default function DashboardLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12"
      data-motion-loading
    >
      <DashboardSkeleton />
    </section>
  );
}

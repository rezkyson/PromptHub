import {
  FilterSkeleton,
  MyPromptListSkeleton,
  SectionHeaderSkeleton,
} from "@/components/skeleton-layouts";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPromptsLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12"
      data-motion-loading
    >
      <SectionHeaderSkeleton />
      <FilterSkeleton />
      <Skeleton className="mt-5 h-4 w-56" />
      <MyPromptListSkeleton count={4} />
    </section>
  );
}

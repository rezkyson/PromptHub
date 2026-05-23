import {
  FilterSkeleton,
  HeroSkeleton,
  PromptGridSkeleton,
} from "@/components/skeleton-layouts";

export default function FavoritesLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12"
      data-motion-loading
    >
      <HeroSkeleton className="bg-block-pink" />
      <FilterSkeleton />
      <PromptGridSkeleton count={6} />
    </section>
  );
}

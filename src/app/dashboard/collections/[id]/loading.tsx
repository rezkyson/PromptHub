import {
  HeroSkeleton,
  MyPromptListSkeleton,
  SectionHeaderSkeleton,
} from "@/components/skeleton-layouts";

export default function CollectionDetailLoading() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12"
      data-motion-loading
    >
      <HeroSkeleton className="bg-block-lilac" />
      <SectionHeaderSkeleton />
      <MyPromptListSkeleton count={4} />
    </section>
  );
}

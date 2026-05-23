import { PromptFormSkeleton } from "@/components/skeleton-layouts";

export default function NewCollectionLoading() {
  return (
    <section
      className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12"
      data-motion-loading
    >
      <PromptFormSkeleton />
    </section>
  );
}

import { HeaderSkeleton, ProfileSkeleton } from "@/components/skeleton-layouts";

export default function ProfileLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground" data-motion-loading>
      <HeaderSkeleton />
      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <ProfileSkeleton />
      </section>
    </main>
  );
}

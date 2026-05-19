import {
  HeaderSkeleton,
  SettingsSkeleton,
} from "@/components/skeleton-layouts";

export default function SettingsLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground" data-motion-loading>
      <HeaderSkeleton />
      <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
        <SettingsSkeleton />
      </section>
    </main>
  );
}

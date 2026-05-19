import { LoadingState } from "@/components/loading-state";

export default function PromptDetailLoading() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <section className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 lg:px-12">
        <LoadingState label="Memuat detail prompt" />
      </section>
    </main>
  );
}

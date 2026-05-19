import { LoadingState } from "@/components/loading-state";

export default function MyPromptsLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <LoadingState label="Memuat prompt saya" />
    </section>
  );
}

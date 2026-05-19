import { LoadingState } from "@/components/loading-state";

export default function RootLoading() {
  return (
    <main className="min-h-dvh bg-background px-6 py-12 text-foreground sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <LoadingState label="Memuat halaman" />
      </div>
    </main>
  );
}

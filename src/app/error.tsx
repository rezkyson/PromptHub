"use client";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ reset }: RootErrorProps) {
  return (
    <main className="min-h-dvh bg-background px-6 py-12 text-foreground sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-4xl">
        <ErrorState
          action={
            <Button className="rounded-full" onClick={reset} type="button">
              Coba lagi
            </Button>
          }
          description="Terjadi masalah saat memuat halaman. Coba ulangi beberapa saat lagi."
          title="Halaman gagal dimuat."
        />
      </div>
    </main>
  );
}

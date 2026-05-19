import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="min-h-dvh bg-background px-6 py-12 text-foreground sm:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-4xl">
        <EmptyState
          action={
            <Button asChild className="rounded-full">
              <Link href="/">Kembali ke beranda</Link>
            </Button>
          }
          description="Konten yang kamu cari tidak ditemukan atau kamu tidak memiliki akses."
          title="Halaman tidak ditemukan."
        />
      </div>
    </main>
  );
}

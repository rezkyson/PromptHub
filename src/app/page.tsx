import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PromptCard } from "@/components/prompt-card";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getPublicPrompts } from "@/lib/data/prompts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publicPrompts = await getPublicPrompts({ limit: 3 });

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="rounded-3xl bg-block-lime p-8 text-foreground sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            PromptHub MVP
          </p>
          <div className="mt-8 max-w-3xl space-y-6">
            <h1 className="text-5xl font-normal leading-none tracking-tight sm:text-7xl">
              Simpan, cari, copy, dan bagikan prompt AI.
            </h1>
            <p className="max-w-2xl text-xl leading-8">
              PromptHub membantu pengguna AI menyimpan prompt pribadi,
              menemukan prompt publik, dan menyalin prompt yang dibutuhkan
              dengan cepat.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full px-6">
              <Link href="/prompts">Jelajahi prompt</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full px-6">
              <Link href="/dashboard">Buka dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em]">
                Preview
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                Prompt publik terbaru
              </h2>
            </div>
            <Button asChild className="rounded-full" variant="secondary">
              <Link href="/prompts">Lihat semua</Link>
            </Button>
          </div>

          {publicPrompts.length > 0 ? (
            publicPrompts.map((prompt) => (
              <PromptCard
                authorName="Pengguna PromptHub"
                href="/prompts"
                key={prompt.id}
                prompt={prompt}
              />
            ))
          ) : (
            <EmptyState
              title="Belum ada prompt publik."
              description="Jadilah yang pertama membagikan prompt."
            />
          )}
        </div>
      </section>
    </main>
  );
}

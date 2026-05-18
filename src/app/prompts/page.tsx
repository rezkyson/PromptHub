import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PromptCard } from "@/components/prompt-card";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getPublicPrompts } from "@/lib/data/prompts";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const prompts = await getPublicPrompts({ limit: 12 });

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-3xl bg-block-lilac p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Jelajahi Prompt
          </p>
          <h1 className="mt-8 max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Temukan prompt publik dari pengguna PromptHub.
          </h1>
        </div>

        {prompts.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                authorName="Pengguna PromptHub"
                href="/prompts"
                key={prompt.id}
                prompt={prompt}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button asChild className="rounded-full">
                <Link href="/register">Register</Link>
              </Button>
            }
            className="mt-8"
            description="Jadilah yang pertama membagikan prompt."
            title="Belum ada prompt publik."
          />
        )}
      </section>
    </main>
  );
}

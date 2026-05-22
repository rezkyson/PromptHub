import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  CompassIcon,
  LayoutDashboardIcon,
  UserRoundIcon,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CopyPromptButton } from "@/components/prompts/copy-prompt-button";
import { FavoritePromptButton } from "@/components/prompts/favorite-prompt-button";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data/auth";
import { getPublicPrompts } from "@/lib/data/prompts";
import { formatDate } from "@/lib/formatters";
import type { Prompt } from "@/types/prompt";

export const dynamic = "force-dynamic";

function getPromptAuthorName(prompt: Prompt) {
  if (prompt.author?.displayName) {
    return prompt.author.displayName;
  }

  if (prompt.author?.username) {
    return `@${prompt.author.username}`;
  }

  return "Pengguna PromptHub";
}

function HomePromptPreviewCard({
  isAuthenticated,
  prompt,
}: {
  isAuthenticated: boolean;
  prompt: Prompt;
}) {
  const visibleTags = prompt.tags.slice(0, 3);

  return (
    <article
      className="group flex min-h-[260px] flex-col rounded-2xl border bg-card p-5 text-card-foreground transition-colors hover:border-primary/40"
      data-motion="card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{prompt.category}</Badge>
        <span className="text-xs text-muted-foreground">
          <CalendarDaysIcon aria-hidden="true" className="mr-1 inline size-3.5" />
          {formatDate(prompt.createdAt)}
        </span>
      </div>

      <div className="mt-5 min-w-0 flex-1">
        <h3 className="line-clamp-2 text-2xl font-medium leading-tight tracking-tight">
          {prompt.title}
        </h3>
        {prompt.description ? (
          <p className="mt-3 line-clamp-2 leading-7 text-muted-foreground">
            {prompt.description}
          </p>
        ) : null}
      </div>

      {visibleTags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate text-sm text-muted-foreground">
          <UserRoundIcon aria-hidden="true" className="mr-1 inline size-4" />
          {getPromptAuthorName(prompt)}
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <FavoritePromptButton
            iconOnly
            isAuthenticated={isAuthenticated}
            isFavorited={prompt.isFavorited}
            promptId={prompt.id}
          />
          <CopyPromptButton content={prompt.content} iconOnly label="Copy" />
          <Button
            asChild
            aria-label="Lihat detail prompt"
            className="rounded-full"
            size="icon-lg"
            title="Lihat detail prompt"
            variant="secondary"
          >
            <Link href={`/prompts/${prompt.id}`}>
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  const [user, publicPrompts] = await Promise.all([
    getCurrentUser(),
    getPublicPrompts({ limit: 6 }),
  ]);

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-8 rounded-3xl bg-block-lime p-8 text-foreground sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.16em]">
              PromptHub
            </p>
            <div className="mt-8 max-w-3xl space-y-6">
              <h1 className="text-5xl font-normal leading-none tracking-tight sm:text-7xl">
                Simpan, cari, copy, dan bagikan prompt AI.
              </h1>
              <p className="max-w-2xl text-xl leading-8">
                Satu tempat untuk prompt pribadi dan prompt publik yang bisa
                langsung kamu pakai lagi.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-6">
                <Link href="/prompts">
                  <CompassIcon aria-hidden="true" />
                  Jelajahi prompt
                </Link>
              </Button>
              <Button asChild variant="secondary" className="rounded-full px-6">
                <Link href="/dashboard">
                  <LayoutDashboardIcon aria-hidden="true" />
                  Buka dashboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/15 bg-background/80 p-5 text-foreground shadow-sm dark:bg-card/85">
            <p className="font-mono text-xs uppercase tracking-[0.16em]">
              Prompt terbaru
            </p>
            <p className="mt-4 text-4xl font-normal leading-none tracking-tight">
              {publicPrompts.length || 0}
            </p>
            <p className="mt-3 leading-7 text-muted-foreground">
              Beberapa prompt publik terbaru untuk mulai eksplorasi dengan
              cepat.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em]">
              Terbaru
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-tight">
              Prompt publik pilihan terbaru
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Lihat ringkasan prompt terbaru di sini, atau buka halaman
              Jelajahi Prompt untuk mencari lebih banyak.
            </p>
          </div>
          <Button asChild className="rounded-full" variant="secondary">
            <Link href="/prompts">
              Lihat semua prompt
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {publicPrompts.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {publicPrompts.map((prompt) => (
              <HomePromptPreviewCard
                isAuthenticated={Boolean(user)}
                key={prompt.id}
                prompt={prompt}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            title="Belum ada prompt publik."
            description="Jadilah yang pertama membagikan prompt."
          />
        )}
      </section>
    </main>
  );
}

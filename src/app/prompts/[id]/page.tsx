import Link from "next/link";
import {
  CalendarDaysIcon,
  FileTextIcon,
  PencilIcon,
  RefreshCwIcon,
  UserRoundIcon,
} from "lucide-react";
import { notFound } from "next/navigation";

import { DeletePromptDialog } from "@/components/prompts/delete-prompt-dialog";
import { CopyPromptButton } from "@/components/prompts/copy-prompt-button";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data/auth";
import { getPromptById } from "@/lib/data/prompts";
import { formatDateTime } from "@/lib/formatters";

type PromptDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id } = await params;
  const [user, prompt] = await Promise.all([getCurrentUser(), getPromptById(id)]);

  if (!prompt) {
    notFound();
  }

  const isOwner = user?.id === prompt.userId;
  const authorName =
    prompt.author?.displayName ||
    (prompt.author?.username ? `@${prompt.author.username}` : "Pengguna PromptHub");

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-3xl bg-block-lime p-8 sm:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{prompt.category}</Badge>
            <Badge variant={prompt.visibility === "public" ? "default" : "outline"}>
              {prompt.visibility === "public" ? "Public" : "Private"}
            </Badge>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            {prompt.title}
          </h1>

          {prompt.description ? (
            <p className="mt-6 max-w-3xl text-xl leading-8">
              {prompt.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
          <article className="rounded-3xl border bg-card p-5 text-card-foreground sm:p-6">
            <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em]">
                  <FileTextIcon aria-hidden="true" className="mr-2 inline size-4" />
                  Prompt Content
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm">
                  <UserRoundIcon aria-hidden="true" className="size-4" />
                  Author: {authorName}
                </p>
              </div>
              <CopyPromptButton content={prompt.content} />
            </div>

            <pre className="whitespace-pre-wrap break-words rounded-2xl bg-muted p-4 font-mono text-sm leading-7">
              {prompt.content}
            </pre>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border bg-card p-5 text-card-foreground">
              <p className="font-mono text-xs uppercase tracking-[0.16em]">
                Metadata
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium">Dibuat</dt>
                  <dd className="mt-1 inline-flex items-center gap-1">
                    <CalendarDaysIcon aria-hidden="true" className="size-4" />
                    {formatDateTime(prompt.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Diperbarui</dt>
                  <dd className="mt-1 inline-flex items-center gap-1">
                    <RefreshCwIcon aria-hidden="true" className="size-4" />
                    {formatDateTime(prompt.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            {isOwner ? (
              <div className="rounded-3xl border bg-card p-5 text-card-foreground">
                <p className="font-mono text-xs uppercase tracking-[0.16em]">
                  Owner Actions
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="rounded-full">
                    <Link href={`/dashboard/prompts/${prompt.id}/edit`}>
                      <PencilIcon aria-hidden="true" />
                      Edit
                    </Link>
                  </Button>
                  <DeletePromptDialog promptId={prompt.id} />
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

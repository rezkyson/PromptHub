import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  Globe2Icon,
  LockKeyholeIcon,
  UserRoundIcon,
} from "lucide-react";

import { CopyPromptButton } from "@/components/prompts/copy-prompt-button";
import { FavoritePromptButton } from "@/components/prompts/favorite-prompt-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { Prompt } from "@/types/prompt";

type PromptCardProps = {
  prompt: Prompt;
  authorName?: string;
  href?: string;
  isAuthenticated?: boolean;
};

function getPromptAuthorName(prompt: Prompt, fallback: string) {
  if (prompt.author?.displayName) {
    return prompt.author.displayName;
  }

  if (prompt.author?.username) {
    return `@${prompt.author.username}`;
  }

  return fallback;
}

export function PromptCard({
  prompt,
  authorName = "Pengguna PromptHub",
  href = `/prompts/${prompt.id}`,
  isAuthenticated = false,
}: PromptCardProps) {
  const displayAuthorName = getPromptAuthorName(prompt, authorName);

  return (
    <article
      className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-5 text-card-foreground"
      data-motion="card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{prompt.category}</Badge>
        <Badge variant={prompt.visibility === "public" ? "default" : "outline"}>
          {prompt.visibility === "public" ? (
            <Globe2Icon aria-hidden="true" />
          ) : (
            <LockKeyholeIcon aria-hidden="true" />
          )}
          {prompt.visibility === "public" ? "Public" : "Private"}
        </Badge>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <h3 className="line-clamp-2 text-2xl font-medium tracking-tight">
          {prompt.title}
        </h3>
        {prompt.description ? (
          <p className="line-clamp-3 leading-7">{prompt.description}</p>
        ) : null}
      </div>
      {prompt.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      <div className="grid gap-4 border-t pt-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <UserRoundIcon aria-hidden="true" className="size-4" />
            {displayAuthorName}
          </span>
          <span aria-hidden="true">-</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDaysIcon aria-hidden="true" className="size-4" />
            {formatDate(prompt.createdAt)}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {prompt.visibility === "public" ? (
            <FavoritePromptButton
              iconOnly
              isAuthenticated={isAuthenticated}
              isFavorited={prompt.isFavorited}
              promptId={prompt.id}
            />
          ) : null}
          <CopyPromptButton content={prompt.content} iconOnly label="Copy" />
          <Button
            asChild
            aria-label="Lihat detail prompt"
            className="rounded-full"
            size="icon-lg"
            title="Lihat detail prompt"
            variant="secondary"
          >
            <Link href={href}>
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

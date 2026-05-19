import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  Globe2Icon,
  LockKeyholeIcon,
  UserRoundIcon,
} from "lucide-react";

import { CopyPromptButton } from "@/components/prompts/copy-prompt-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { Prompt } from "@/types/prompt";

type PromptCardProps = {
  prompt: Prompt;
  authorName?: string;
  href?: string;
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
      <div className="flex flex-col gap-4 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
        <div className="flex flex-wrap gap-2">
          <CopyPromptButton content={prompt.content} label="Copy" />
          <Button asChild className="rounded-full" variant="secondary">
            <Link href={href}>
              Detail
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

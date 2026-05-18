import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { Prompt } from "@/types/prompt";

type PromptCardProps = {
  prompt: Prompt;
  authorName?: string;
  href?: string;
};

export function PromptCard({
  prompt,
  authorName = "Pengguna PromptHub",
  href = `/prompts/${prompt.id}`,
}: PromptCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-5 text-card-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{prompt.category}</Badge>
        <Badge variant={prompt.visibility === "public" ? "default" : "outline"}>
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
        <p>
          {authorName} - {formatDate(prompt.createdAt)}
        </p>
        <Button asChild className="rounded-full">
          <Link href={href}>Lihat detail</Link>
        </Button>
      </div>
    </article>
  );
}

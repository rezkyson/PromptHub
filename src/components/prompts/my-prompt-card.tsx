import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { Prompt } from "@/types/prompt";

type MyPromptCardProps = {
  prompt: Prompt;
};

export function MyPromptCard({ prompt }: MyPromptCardProps) {
  return (
    <article className="grid gap-5 rounded-2xl border bg-card p-5 text-card-foreground lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{prompt.category}</Badge>
          <Badge variant={prompt.visibility === "public" ? "default" : "outline"}>
            {prompt.visibility === "public" ? "Public" : "Private"}
          </Badge>
          <span className="text-sm">{formatDate(prompt.createdAt)}</span>
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight">{prompt.title}</h2>
          {prompt.description ? (
            <p className="mt-2 line-clamp-2 leading-7">{prompt.description}</p>
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
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        <Button asChild className="rounded-full" variant="secondary">
          <Link href={`/prompts/${prompt.id}`}>Lihat</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href={`/dashboard/prompts/${prompt.id}/edit`}>Edit</Link>
        </Button>
        <Button
          className="rounded-full"
          disabled
          title="Aksi hapus dibuat pada Phase 10"
          variant="secondary"
        >
          Hapus
        </Button>
      </div>
    </article>
  );
}

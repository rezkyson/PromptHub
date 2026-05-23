import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  FileTextIcon,
  FolderIcon,
  PencilIcon,
} from "lucide-react";

import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import type { Collection } from "@/types/collection";

type CollectionCardProps = {
  collection: Collection;
};

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article
      className="flex min-h-[220px] flex-col rounded-2xl border bg-card p-5 text-card-foreground"
      data-motion="card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          <FolderIcon aria-hidden="true" />
          Collection
        </Badge>
        <Badge variant="outline">
          <FileTextIcon aria-hidden="true" />
          {collection.promptCount} prompt
        </Badge>
      </div>

      <div className="mt-5 min-w-0 flex-1 space-y-3">
        <h2 className="line-clamp-2 text-2xl font-medium tracking-tight">
          {collection.name}
        </h2>
        {collection.description ? (
          <p className="line-clamp-3 leading-7 text-muted-foreground">
            {collection.description}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarDaysIcon aria-hidden="true" className="size-4" />
          {formatDate(collection.updatedAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="rounded-full" variant="secondary">
            <Link href={`/dashboard/collections/${collection.id}`}>
              Buka
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href={`/dashboard/collections/${collection.id}/edit`}>
              <PencilIcon aria-hidden="true" />
              Edit
            </Link>
          </Button>
          <DeleteCollectionDialog collectionId={collection.id} />
        </div>
      </div>
    </article>
  );
}
